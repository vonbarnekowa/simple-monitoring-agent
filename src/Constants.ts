export class Constants {
  // Error messages
  public static MONGODB_CONNECT_URL = 'mongodb://localhost/smw';

  // Configuration
  public static API_URL = process.env.API_URL || 'http://localhost:3031';
  public static API_GET_ALL_URL = '/monitors/all';
  public static API_POST_FEEDBACK_URL = `/monitors/{monitor_id}/feedback/add`;
}
