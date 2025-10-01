export enum AlertType {
    ERROR = "error",
    WARNING = "warning",
    INFO = "info",
    SUCCESS = "success",
  }
  
  export interface Alert {
    id?: string;
    message: string;
    type: AlertType;
    duration: number;
  }