export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          name: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash: string;
          name: string;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string;
          name?: string;
          role?: string;
          created_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          password_hash: string;
          registration_date: string;
          total_kiosks: number;
          total_revenue: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          password_hash: string;
          registration_date?: string;
          total_kiosks?: number;
          total_revenue?: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          password_hash?: string;
          registration_date?: string;
          total_kiosks?: number;
          total_revenue?: number;
          status?: string;
          created_at?: string;
        };
      };
      kiosks: {
        Row: {
          id: string;
          name: string;
          location: string;
          qr_code: string;
          status: string;
          total_payments: number;
          liquid_level: number;
          needs_refill: boolean;
          last_maintenance: string;
          total_revenue: number;
          owner_revenue: number;
          platform_revenue: number;
          customer_id: string;
          price_per_cleaning: number;
          refill_limit: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          location: string;
          qr_code: string;
          status?: string;
          total_payments?: number;
          liquid_level?: number;
          needs_refill?: boolean;
          last_maintenance?: string;
          total_revenue?: number;
          owner_revenue?: number;
          platform_revenue?: number;
          customer_id: string;
          price_per_cleaning?: number;
          refill_limit?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string;
          qr_code?: string;
          status?: string;
          total_payments?: number;
          liquid_level?: number;
          needs_refill?: boolean;
          last_maintenance?: string;
          total_revenue?: number;
          owner_revenue?: number;
          platform_revenue?: number;
          customer_id?: string;
          price_per_cleaning?: number;
          refill_limit?: number;
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          kiosk_id: string;
          amount: number;
          currency: string;
          status: string;
          razorpay_payment_id: string;
          timestamp: string;
          customer_phone: string | null;
          refund_amount: number | null;
          refund_reason: string | null;
          platform_fee: number;
          owner_revenue: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          kiosk_id: string;
          amount: number;
          currency?: string;
          status: string;
          razorpay_payment_id: string;
          timestamp?: string;
          customer_phone?: string | null;
          refund_amount?: number | null;
          refund_reason?: string | null;
          platform_fee: number;
          owner_revenue: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          kiosk_id?: string;
          amount?: number;
          currency?: string;
          status?: string;
          razorpay_payment_id?: string;
          timestamp?: string;
          customer_phone?: string | null;
          refund_amount?: number | null;
          refund_reason?: string | null;
          platform_fee?: number;
          owner_revenue?: number;
          created_at?: string;
        };
      };
      maintenance_requests: {
        Row: {
          id: string;
          kiosk_id: string;
          customer_id: string;
          type: string;
          priority: string;
          description: string;
          status: string;
          request_date: string;
          completed_date: string | null;
          assigned_technician: string | null;
          cost: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          kiosk_id: string;
          customer_id: string;
          type: string;
          priority: string;
          description: string;
          status?: string;
          request_date?: string;
          completed_date?: string | null;
          assigned_technician?: string | null;
          cost?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          kiosk_id?: string;
          customer_id?: string;
          type?: string;
          priority?: string;
          description?: string;
          status?: string;
          request_date?: string;
          completed_date?: string | null;
          assigned_technician?: string | null;
          cost?: number | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          type: string;
          kiosk_id: string | null;
          customer_id: string | null;
          message: string;
          timestamp: string;
          read: boolean;
          priority: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          kiosk_id?: string | null;
          customer_id?: string | null;
          message: string;
          timestamp?: string;
          read?: boolean;
          priority?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          kiosk_id?: string | null;
          customer_id?: string | null;
          message?: string;
          timestamp?: string;
          read?: boolean;
          priority?: string;
          created_at?: string;
        };
      };
      refill_requests: {
        Row: {
          id: string;
          kiosk_id: string;
          customer_id: string;
          requested_amount: number;
          status: string;
          request_date: string;
          approved_date: string | null;
          completed_date: string | null;
          cost: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          kiosk_id: string;
          customer_id: string;
          requested_amount: number;
          status?: string;
          request_date?: string;
          approved_date?: string | null;
          completed_date?: string | null;
          cost?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          kiosk_id?: string;
          customer_id?: string;
          requested_amount?: number;
          status?: string;
          request_date?: string;
          approved_date?: string | null;
          completed_date?: string | null;
          cost?: number | null;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
  };
}