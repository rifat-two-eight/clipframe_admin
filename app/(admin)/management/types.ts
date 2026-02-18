export interface Step {
    _id?: string;
    title: string;
    mainTip: string;
    detailedTips?: string;
    mediaType: "video" | "image";
    url?: string;
    videoFile?: File | null;
    shotType: string;
    duration: string;
}

export interface Template {
    _id?: string;
    title: string;
    type: string;
    category: string;
    thumbnail?: string;
    thumbnailFile?: File | null;
    steps: Step[];
    hashtags: string[];
    isActive: boolean;
    stats?: {
        reuseCount: number;
        loveCount: number;
        lovedBy?: string[];
    };
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: {
        _id: string;
        name: string;
        email: string;
    };
}
