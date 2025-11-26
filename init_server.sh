#!/usr/bin/env bash
set -euo pipefail

# init_server.sh
# Скрипт инициализации Ubuntu 22.04 для хоста Docker + базовая безопасность
# Запуск: сохранить на сервере и выполнить: sudo bash init_server.sh

TARGET_DIR="/opt/kyda-tech"
DOCKER_PACKAGES=(apt-transport-https ca-certificates curl gnupg lsb-release software-properties-common)
BASE_PACKAGES=(curl wget git ufw)

log() { echo "[+] $*"; }
err() { echo "[!] $*" >&2; }

# Определяем пользователя, который вызвал sudo (если есть)
INVOKER="${SUDO_USER:-$(whoami)}"

if [ "$(id -u)" -ne 0 ]; then
  err "Этот скрипт должен быть запущен от root или через sudo. Повторите: sudo bash init_server.sh"
  exit 1
fi

log "Запуск инициализации. Инициатор: ${INVOKER}"

log "1) Обновление системы"
apt update -y
DEBIAN_FRONTEND=noninteractive apt upgrade -y

log "2) Установка базовых пакетов"
apt install -y "${DOCKER_PACKAGES[@]}" "${BASE_PACKAGES[@]}"

log "3) Установка Docker Engine и Compose (официально)"
# Add Docker GPG key and repo
if [ ! -f /etc/apt/keyrings/docker.gpg ]; then
  mkdir -p /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
fi
ARCH=$(dpkg --print-architecture)
CODENAME=$(lsb_release -cs)
DOCKER_LIST="deb [arch=$ARCH signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $CODENAME stable"
if ! grep -Fxq "$DOCKER_LIST" /etc/apt/sources.list.d/docker.list 2>/dev/null; then
  echo "$DOCKER_LIST" > /etc/apt/sources.list.d/docker.list
fi
apt update -y
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

log "4) Настройка доступа без sudo (добавление в группу docker)"
if getent group docker > /dev/null 2>&1; then
  log "Группа docker уже существует"
else
  groupadd docker || true
fi
if id -nG "$INVOKER" | grep -qw docker; then
  log "Пользователь $INVOKER уже в группе docker"
else
  usermod -aG docker "$INVOKER"
  log "Добавил $INVOKER в группу docker (изменение вступит в силу после повторного входа)"
fi

log "5) Настройка UFW (firewall)"
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
# Dev ports (открываются сейчас для разработки; в продакшне закройте их)
ufw allow 5601/tcp comment 'Kibana (dev)'
ufw allow 9090/tcp comment 'Grafana (dev)'
ufw --force enable

log "6) Настройка системных лимитов для Java/Kafka"
cat > /etc/security/limits.d/99-kyda-tech.conf <<'EOF'
# Increased limits for Kafka and other Java services
* soft nofile 100000
* hard nofile 100000
root soft nofile 100000
root hard nofile 100000
EOF

cat > /etc/sysctl.d/99-kyda-tech.conf <<'EOF'
# Kernel settings for Kafka/Java
vm.max_map_count=262144
fs.file-max=2097152
EOF
sysctl --system

log "7) Создание структуры директорий в ${TARGET_DIR}"
mkdir -p "${TARGET_DIR}"
mkdir -p "${TARGET_DIR}/data/postgres"
mkdir -p "${TARGET_DIR}/data/kafka"
mkdir -p "${TARGET_DIR}/data/minio"
mkdir -p "${TARGET_DIR}/data/redis"
mkdir -p "${TARGET_DIR}/configs/nginx"
mkdir -p "${TARGET_DIR}/configs/traefik"
mkdir -p "${TARGET_DIR}/logs"

# Создаём шаблоны файлов, если их ещё нет
if [ ! -f "${TARGET_DIR}/docker-compose.yml" ]; then
  cat > "${TARGET_DIR}/docker-compose.yml" <<'YAML'
# docker-compose.yml — заполните по необходимости
version: '3.8'
services:
  # placeholder
YAML
fi

if [ ! -f "${TARGET_DIR}/.env" ]; then
  touch "${TARGET_DIR}/.env"
  chmod 600 "${TARGET_DIR}/.env"
fi

log "Установка прав на ${TARGET_DIR} для пользователя ${INVOKER}"
chown -R "${INVOKER}:" "${TARGET_DIR}"

log "8) Инициализация git-репозитория и .gitignore"
GIT_DIR=${TARGET_DIR}
if [ ! -d "${GIT_DIR}/.git" ]; then
  sudo -u "$INVOKER" git -C "$GIT_DIR" init
fi
cat > "${GIT_DIR}/.gitignore" <<'EOF'
# Secrets and runtime data
.env
/data/
EOF

# Настройка локального git user (на случай если не настроен)
sudo -u "$INVOKER" git -C "$GIT_DIR" config user.email "init@kyda-tech.local" || true
sudo -u "$INVOKER" git -C "$GIT_DIR" config user.name "kyda-tech-init" || true
sudo -u "$INVOKER" git -C "$GIT_DIR" add .
# Если есть что коммитить
if sudo -u "$INVOKER" git -C "$GIT_DIR" status --porcelain | grep . >/dev/null 2>&1; then
  sudo -u "$INVOKER" git -C "$GIT_DIR" commit -m "Initial commit: repository skeleton"
else
  log "Нечего коммитить (пусто или уже закоммичено)"
fi

log "9) Проверка установок"
log "docker --version:"; docker --version
log "docker compose version:"; docker compose version || true

log "Проверка статуса UFW:"; ufw status verbose

log "Готово. Пожалуйста, перелогиньтесь как '${INVOKER}' или перезапустите сессию, чтобы вступили в силу права группы docker."

cat <<EOF
Краткие команды для локальной проверки (выполните как ${INVOKER}):
  - docker --version
  - docker compose version
  - ufw status verbose
  - ls -la ${TARGET_DIR}
EOF

exit 0
