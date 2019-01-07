export interface Provider {
  name: string;
  enabled: boolean;
  enabled_in_list: boolean;
  languages: string[];
  base_url: string;
  response_type: 'json' | 'text';
  time_to_wait_between_each_request_ms?: number;
  time_to_wait_on_too_many_request_ms?: number;
  token?: {
    query: string;
    token_validity_time_ms?: number;
    token_format: {
      token: string;
    };
  };
  separator?: string;
  movie?: {
    query: string;
    keywords: string;
  };
  episode?: {
    query: string;
    keywords: string;
  };
  json_format?: {
    results: string;
    sub_results?: string;
    url: string;
    title: string;
    seeds: string;
    peers: string;
    size: string;
    quality?: string;
  };
  html_parser?: {
    row: string;
    url: string;
    title: string;
    seeds: string;
    peers: string;
    size: string;
  };
}
