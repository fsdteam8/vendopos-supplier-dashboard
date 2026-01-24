export interface OnboardingResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    url: string;
    account: StripeAccount;
    onboardingLink: OnboardingLink;
  };
}

export interface StripeAccount {
  id: string;
  object: string;
  business_profile: {
    annual_revenue: any;
    estimated_worker_count: any;
    mcc: any;
    minority_owned_business_designation: any;
    name: any;
    product_description: any;
    specified_commercial_transactions_act_url: any;
    support_address: any;
    support_email: any;
    support_phone: any;
    support_url: any;
    url: any;
  };
  business_type: any;
  capabilities: {
    card_payments: string;
    transfers: string;
  };
  charges_enabled: boolean;
  controller: {
    fees: {
      payer: string;
    };
    is_controller: boolean;
    losses: {
      payments: string;
    };
    requirement_collection: string;
    stripe_dashboard: {
      type: string;
    };
    type: string;
  };
  country: string;
  created: number;
  default_currency: string;
  details_submitted: boolean;
  email: string;
  external_accounts: {
    object: string;
    data: any[];
    has_more: boolean;
    total_count: number;
    url: string;
  };
  future_requirements: {
    alternatives: any[];
    current_deadline: any;
    currently_due: string[];
    disabled_reason: any;
    errors: any[];
    eventually_due: string[];
    past_due: string[];
    pending_verification: any[];
  };
  login_links: {
    object: string;
    data: any[];
    has_more: boolean;
    total_count: number;
    url: string;
  };
  metadata: Record<string, any>;
  payouts_enabled: boolean;
  requirements: {
    alternatives: any[];
    current_deadline: any;
    currently_due: string[];
    disabled_reason: string;
    errors: any[];
    eventually_due: string[];
    past_due: string[];
    pending_verification: any[];
  };
  settings: {
    bacs_debit_payments: {
      display_name: any;
      service_user_number: any;
    };
    branding: {
      icon: any;
      logo: any;
      primary_color: any;
      secondary_color: any;
    };
    card_issuing: {
      tos_acceptance: {
        date: any;
        ip: any;
      };
    };
    card_payments: {
      decline_on: {
        avs_failure: boolean;
        cvc_failure: boolean;
      };
      statement_descriptor_prefix: any;
      statement_descriptor_prefix_kana: any;
      statement_descriptor_prefix_kanji: any;
    };
    dashboard: {
      display_name: any;
      timezone: string;
    };
    invoices: {
      default_account_tax_ids: any;
      hosted_payment_method_save: string;
    };
    payments: {
      statement_descriptor: any;
      statement_descriptor_kana: any;
      statement_descriptor_kanji: any;
    };
    payouts: {
      debit_negative_balances: boolean;
      schedule: {
        delay_days: number;
        interval: string;
      };
      statement_descriptor: any;
    };
    paypay_payments: {};
    sepa_debit_payments: {};
  };
  tos_acceptance: {
    date: any;
    ip: any;
    user_agent: any;
  };
  type: string;
}

export interface OnboardingLink {
  object: string;
  created: number;
  expires_at: number;
  url: string;
}
