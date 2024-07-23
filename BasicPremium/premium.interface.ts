export interface Premium {
    from_age: number;
    to_age: number;
    gender: string;
    member_type: string;
    premium: number;
    maternity_premium: number | null;
    minimum_premium: string | null;
  }