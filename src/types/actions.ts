export interface ActionResult<T = void> {
  ok: boolean;
  data?: T;
  error?: string;
}
