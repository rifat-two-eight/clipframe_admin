import api from '@/lib/axios';
import { SubscriptionPlan } from '@/app/(admin)/management/types';

export interface SubscriptionAnalytics {
    monthlyRevenue: number;
    activeSubscriptions: number;
    churnRate: number;
}

export interface UserSubscription {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        profile?: string;
    };
    planId: SubscriptionPlan;
    status: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    isActive?: boolean;
    usage?: {
        reelsUsed: number;
        postsUsed: number;
        storiesUsed: number;
        businessesUsed: number;
        carouselUsed: number;
    };
}

export const subscriptionService = {
    // Get all plans for admin
    getAllPlans: async (): Promise<SubscriptionPlan[]> => {
        const response = await api.get('/subscription/admin/plans');
        return response.data.data;
    },

    // Create new plan
    createPlan: async (payload: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> => {
        const response = await api.post('/subscription/admin/plans', payload);
        return response.data.data;
    },

    // Update plan
    updatePlan: async (planId: string, payload: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> => {
        const response = await api.patch(`/subscription/admin/plans/${planId}`, payload);
        return response.data.data;
    },

    // Get Analytics
    getAnalytics: async (): Promise<SubscriptionAnalytics> => {
        const response = await api.get('/subscription/admin/analytics');
        return response.data.data;
    },

    // Get All Subscriptions
    getAllSubscriptions: async (): Promise<UserSubscription[]> => {
        const response = await api.get('/subscription/admin/all-subscriptions');
        return response.data.data;
    }
};
