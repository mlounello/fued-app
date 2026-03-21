export interface ActiveProfile {
  id: string;
  email: string;
  is_admin: boolean;
  is_disabled: boolean;
  display_name: string | null;
}
