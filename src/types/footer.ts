export interface FooterTemplate {
  id: string;
  name: string;
  description?: string;
  is_default: boolean;
  logo_url?: string;
  layout_config: FooterConfig;
  template_type: 'components' | 'full_image';
  full_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface FooterConfig {
  height: string;
  backgroundColor: string;
  logoPosition: 'left' | 'center' | 'right';
  logoMaxWidth: number;
  logoMaxHeight: number;
  pageNumberPosition: 'left' | 'center' | 'right';
  pageNumberStyle: {
    backgroundColor: string;
    borderRadius: number;
    width: string;
    height: string;
    color: string;
    fontSize: number;
    fontWeight: string;
  };
  dottedLineStyle: {
    color: string;
    width: number;
    height: number;
    marginRight: number;
  };
}

export interface PageFooter {
  id: string;
  page_id: string;
  footer_template_id: string;
  is_enabled: boolean;
  page_number: number;
  created_at: string;
  updated_at: string;
}