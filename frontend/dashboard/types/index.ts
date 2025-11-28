export interface User {
    id: string;
    email: string;
    name: string;
    role: "admin" | "operator";
}

export interface Transaction {
    id: string;
    amount: number;
    currency: string;
    status: "pending" | "approved" | "rejected";
    timestamp: string;
    description: string;
    flaggedReason?: string;
    riskScore: number;
    shapValues?: {
        feature: string;
        value: number;
    }[];
    // New: multi-level detection cascade metadata
    detection?: {
        level: "Level 0" | "Level 1" | "Level 2" | "Manual";
        urgency?: "low" | "medium" | "high"; // used for visual highlighting
        // path lists the steps and results at each level (used to explain cascade)
        path?: { step: string; detail?: string | number }[];
        operatorDecision?: string | null; // if manually handled
    };
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export interface MLModelVersion {
    version: string;
    stage: "Production" | "Staging" | "None" | "Archived";
    metrics: {
        accuracy: number;
        precision: number;
        recall: number;
        f1: number;
    };
    lastUpdated: string;
}

export interface MLModel {
    name: string;
    versions: MLModelVersion[];
}

export interface SystemConfig {
    riskThreshold: number;
    maintenanceMode: boolean;
    mlflowUrl: string;
}
