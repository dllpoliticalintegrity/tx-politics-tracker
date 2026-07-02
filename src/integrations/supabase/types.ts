export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      _house_candidates_fuzzy_matches: {
        Row: {
          fec_chamber: string | null
          fec_district: number | null
          fec_fec_id: string
          fec_id: string
          fec_name: string | null
          fec_party: string | null
          fec_state: string | null
          fec_status: string | null
          house_district: number | null
          house_doc_id: number | null
          house_filed_date: string | null
          house_filer_district: string | null
          house_filer_name: string
          house_state: string | null
          match_score: number | null
          matched: boolean | null
        }
        Insert: {
          fec_chamber?: string | null
          fec_district?: number | null
          fec_fec_id: string
          fec_id: string
          fec_name?: string | null
          fec_party?: string | null
          fec_state?: string | null
          fec_status?: string | null
          house_district?: number | null
          house_doc_id?: number | null
          house_filed_date?: string | null
          house_filer_district?: string | null
          house_filer_name: string
          house_state?: string | null
          match_score?: number | null
          matched?: boolean | null
        }
        Update: {
          fec_chamber?: string | null
          fec_district?: number | null
          fec_fec_id?: string
          fec_id?: string
          fec_name?: string | null
          fec_party?: string | null
          fec_state?: string | null
          fec_status?: string | null
          house_district?: number | null
          house_doc_id?: number | null
          house_filed_date?: string | null
          house_filer_district?: string | null
          house_filer_name?: string
          house_state?: string | null
          match_score?: number | null
          matched?: boolean | null
        }
        Relationships: []
      }
      _senate_candidates_fuzzy_matches: {
        Row: {
          fec_chamber: string | null
          fec_fec_id: string | null
          fec_id: string | null
          fec_name: string | null
          fec_party: string | null
          fec_state: string | null
          fec_status: string | null
          match_score: number | null
          matched: boolean | null
          senate_filed_date: string | null
          senate_filer_name: string
          senate_filer_state: string | null
          senate_state: string | null
          senate_uuid: string | null
        }
        Insert: {
          fec_chamber?: string | null
          fec_fec_id?: string | null
          fec_id?: string | null
          fec_name?: string | null
          fec_party?: string | null
          fec_state?: string | null
          fec_status?: string | null
          match_score?: number | null
          matched?: boolean | null
          senate_filed_date?: string | null
          senate_filer_name: string
          senate_filer_state?: string | null
          senate_state?: string | null
          senate_uuid?: string | null
        }
        Update: {
          fec_chamber?: string | null
          fec_fec_id?: string | null
          fec_id?: string | null
          fec_name?: string | null
          fec_party?: string | null
          fec_state?: string | null
          fec_status?: string | null
          match_score?: number | null
          matched?: boolean | null
          senate_filed_date?: string | null
          senate_filer_name?: string
          senate_filer_state?: string | null
          senate_state?: string | null
          senate_uuid?: string | null
        }
        Relationships: []
      }
      ai_companies: {
        Row: {
          aliases: string[] | null
          category: string | null
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          aliases?: string[] | null
          category?: string | null
          created_at?: string | null
          id: string
          logo_url?: string | null
          name: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          aliases?: string[] | null
          category?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      ai_individual_contributions: {
        Row: {
          candidate_id: string | null
          candidate_name: string | null
          committee_id: string
          committee_name: string | null
          company_id: string | null
          contribution_receipt_amount: number | null
          contribution_receipt_date: string | null
          contributor_employer: string | null
          contributor_name: string | null
          contributor_occupation: string | null
          contributor_state: string | null
          contributor_zip: string | null
          election_type: string | null
          election_year: number | null
          filing_form: string | null
          id: string
          imported_at: string | null
          individual_id: string | null
          is_earmark: boolean | null
          line_number: string | null
          memo_code: string | null
          memo_text: string | null
          pdf_url: string | null
          receipt_type: string | null
          receipt_type_desc: string | null
          report_type: string | null
          report_year: number | null
          sub_id: string
          transaction_id: string | null
          two_year_transaction_period: number | null
        }
        Insert: {
          candidate_id?: string | null
          candidate_name?: string | null
          committee_id: string
          committee_name?: string | null
          company_id?: string | null
          contribution_receipt_amount?: number | null
          contribution_receipt_date?: string | null
          contributor_employer?: string | null
          contributor_name?: string | null
          contributor_occupation?: string | null
          contributor_state?: string | null
          contributor_zip?: string | null
          election_type?: string | null
          election_year?: number | null
          filing_form?: string | null
          id?: string
          imported_at?: string | null
          individual_id?: string | null
          is_earmark?: boolean | null
          line_number?: string | null
          memo_code?: string | null
          memo_text?: string | null
          pdf_url?: string | null
          receipt_type?: string | null
          receipt_type_desc?: string | null
          report_type?: string | null
          report_year?: number | null
          sub_id: string
          transaction_id?: string | null
          two_year_transaction_period?: number | null
        }
        Update: {
          candidate_id?: string | null
          candidate_name?: string | null
          committee_id?: string
          committee_name?: string | null
          company_id?: string | null
          contribution_receipt_amount?: number | null
          contribution_receipt_date?: string | null
          contributor_employer?: string | null
          contributor_name?: string | null
          contributor_occupation?: string | null
          contributor_state?: string | null
          contributor_zip?: string | null
          election_type?: string | null
          election_year?: number | null
          filing_form?: string | null
          id?: string
          imported_at?: string | null
          individual_id?: string | null
          is_earmark?: boolean | null
          line_number?: string | null
          memo_code?: string | null
          memo_text?: string | null
          pdf_url?: string | null
          receipt_type?: string | null
          receipt_type_desc?: string | null
          report_type?: string | null
          report_year?: number | null
          sub_id?: string
          transaction_id?: string | null
          two_year_transaction_period?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_individual_contributions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "ai_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_individual_contributions_individual_id_fkey"
            columns: ["individual_id"]
            isOneToOne: false
            referencedRelation: "ai_individuals"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_individuals: {
        Row: {
          company_id: string | null
          created_at: string | null
          employer_keywords: string[] | null
          fec_name_variants: string[] | null
          id: string
          is_active: boolean | null
          name: string
          photo_url: string | null
          specialization: string | null
          title: string | null
          updated_at: string | null
          zip_codes: string[] | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          employer_keywords?: string[] | null
          fec_name_variants?: string[] | null
          id: string
          is_active?: boolean | null
          name: string
          photo_url?: string | null
          specialization?: string | null
          title?: string | null
          updated_at?: string | null
          zip_codes?: string[] | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          employer_keywords?: string[] | null
          fec_name_variants?: string[] | null
          id?: string
          is_active?: boolean | null
          name?: string
          photo_url?: string | null
          specialization?: string | null
          title?: string | null
          updated_at?: string | null
          zip_codes?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_individuals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "ai_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_ratings: {
        Row: {
          approve_pct: number
          created_at: string
          date: string
          disapprove_pct: number
          id: string
          net_pct: number
          poll_count: number
          poll_type: string
          source: string
          subject: string
        }
        Insert: {
          approve_pct: number
          created_at?: string
          date: string
          disapprove_pct: number
          id?: string
          net_pct: number
          poll_count?: number
          poll_type?: string
          source?: string
          subject?: string
        }
        Update: {
          approve_pct?: number
          created_at?: string
          date?: string
          disapprove_pct?: number
          id?: string
          net_pct?: number
          poll_count?: number
          poll_type?: string
          source?: string
          subject?: string
        }
        Relationships: []
      }
      asset_codes: {
        Row: {
          asset_code: string
          asset_name: string | null
        }
        Insert: {
          asset_code: string
          asset_name?: string | null
        }
        Update: {
          asset_code?: string
          asset_name?: string | null
        }
        Relationships: []
      }
      asset_tracker: {
        Row: {
          assetAvg: number | null
          assetMax: number | null
          assetMin: number | null
          assetName: string | null
          assetRange: string | null
          assetType: string | null
          candidate_id: string | null
          date_edited: string | null
          filingDate: string | null
          incomeTotal: string | null
          incomeType: string | null
          isdupe: boolean | null
          Owner: string | null
          stockTicker: string | null
          uuid: string
          yearReported: string | null
        }
        Insert: {
          assetAvg?: number | null
          assetMax?: number | null
          assetMin?: number | null
          assetName?: string | null
          assetRange?: string | null
          assetType?: string | null
          candidate_id?: string | null
          date_edited?: string | null
          filingDate?: string | null
          incomeTotal?: string | null
          incomeType?: string | null
          isdupe?: boolean | null
          Owner?: string | null
          stockTicker?: string | null
          uuid?: string
          yearReported?: string | null
        }
        Update: {
          assetAvg?: number | null
          assetMax?: number | null
          assetMin?: number | null
          assetName?: string | null
          assetRange?: string | null
          assetType?: string | null
          candidate_id?: string | null
          date_edited?: string | null
          filingDate?: string | null
          incomeTotal?: string | null
          incomeType?: string | null
          isdupe?: boolean | null
          Owner?: string | null
          stockTicker?: string | null
          uuid?: string
          yearReported?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_tracker_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_assets"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "asset_tracker_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_committee_fundraising"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "asset_tracker_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_tracker_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "crypto_exec_candidate_totals"
            referencedColumns: ["candidate_uuid"]
          },
          {
            foreignKeyName: "asset_tracker_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "earmarked_by_candidate"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "asset_tracker_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "extension_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_tracker_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "grade_inputs"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "asset_tracker_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pac_cycle_recipients"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "asset_tracker_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pro_israel_pac_candidate_totals"
            referencedColumns: ["candidate_id"]
          },
        ]
      }
      asset_tracker_2024_st_ps: {
        Row: {
          candidate_id: string | null
          total_assetavg_2024_st_ps: number | null
        }
        Insert: {
          candidate_id?: string | null
          total_assetavg_2024_st_ps?: number | null
        }
        Update: {
          candidate_id?: string | null
          total_assetavg_2024_st_ps?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_tracker_2024_st_ps_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_assets"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "asset_tracker_2024_st_ps_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_committee_fundraising"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "asset_tracker_2024_st_ps_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_tracker_2024_st_ps_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "crypto_exec_candidate_totals"
            referencedColumns: ["candidate_uuid"]
          },
          {
            foreignKeyName: "asset_tracker_2024_st_ps_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "earmarked_by_candidate"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "asset_tracker_2024_st_ps_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "extension_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_tracker_2024_st_ps_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "grade_inputs"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "asset_tracker_2024_st_ps_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pac_cycle_recipients"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "asset_tracker_2024_st_ps_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pro_israel_pac_candidate_totals"
            referencedColumns: ["candidate_id"]
          },
        ]
      }
      ca_candidates: {
        Row: {
          bio: string | null
          candidate_filer_id: number
          committee_filer_id: number | null
          committee_name: string | null
          created_at: string
          cycle: string
          election_year: number
          facebook_user: string | null
          featured: boolean
          id: string
          instagram_user: string | null
          name: string
          office: string
          party: string | null
          photo_url: string | null
          photo_url_large: string | null
          photo_url_medium: string | null
          photo_url_thumb: string | null
          race_id: string | null
          slug: string
          status: string | null
          title: string | null
          twitter_user: string | null
          updated_at: string
          website: string | null
          youtube_user: string | null
        }
        Insert: {
          bio?: string | null
          candidate_filer_id: number
          committee_filer_id?: number | null
          committee_name?: string | null
          created_at?: string
          cycle?: string
          election_year?: number
          facebook_user?: string | null
          featured?: boolean
          id?: string
          instagram_user?: string | null
          name: string
          office?: string
          party?: string | null
          photo_url?: string | null
          photo_url_large?: string | null
          photo_url_medium?: string | null
          photo_url_thumb?: string | null
          race_id?: string | null
          slug: string
          status?: string | null
          title?: string | null
          twitter_user?: string | null
          updated_at?: string
          website?: string | null
          youtube_user?: string | null
        }
        Update: {
          bio?: string | null
          candidate_filer_id?: number
          committee_filer_id?: number | null
          committee_name?: string | null
          created_at?: string
          cycle?: string
          election_year?: number
          facebook_user?: string | null
          featured?: boolean
          id?: string
          instagram_user?: string | null
          name?: string
          office?: string
          party?: string | null
          photo_url?: string | null
          photo_url_large?: string | null
          photo_url_medium?: string | null
          photo_url_thumb?: string | null
          race_id?: string | null
          slug?: string
          status?: string | null
          title?: string | null
          twitter_user?: string | null
          updated_at?: string
          website?: string | null
          youtube_user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ca_candidates_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["race_id"]
          },
        ]
      }
      ca_contributions: {
        Row: {
          amend_id: number
          amount: number
          candidate_id: string | null
          city: string | null
          committee_filer_id: number
          contribution_date: string | null
          contributor_first_name: string | null
          contributor_last_name: string | null
          contributor_type: string | null
          created_at: string
          cumulative_ytd: number | null
          cycle: string | null
          employer: string | null
          filing_id: number
          id: string
          occupation: string | null
          source_form_type: string | null
          state: string | null
          tran_id: string
          updated_at: string
          zip: string | null
        }
        Insert: {
          amend_id: number
          amount: number
          candidate_id?: string | null
          city?: string | null
          committee_filer_id: number
          contribution_date?: string | null
          contributor_first_name?: string | null
          contributor_last_name?: string | null
          contributor_type?: string | null
          created_at?: string
          cumulative_ytd?: number | null
          cycle?: string | null
          employer?: string | null
          filing_id: number
          id?: string
          occupation?: string | null
          source_form_type?: string | null
          state?: string | null
          tran_id: string
          updated_at?: string
          zip?: string | null
        }
        Update: {
          amend_id?: number
          amount?: number
          candidate_id?: string | null
          city?: string | null
          committee_filer_id?: number
          contribution_date?: string | null
          contributor_first_name?: string | null
          contributor_last_name?: string | null
          contributor_type?: string | null
          created_at?: string
          cumulative_ytd?: number | null
          cycle?: string | null
          employer?: string | null
          filing_id?: number
          id?: string
          occupation?: string | null
          source_form_type?: string | null
          state?: string | null
          tran_id?: string
          updated_at?: string
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ca_contributions_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "ca_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ca_contributions_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "ca_contributions_summary"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "ca_contributions_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "ca_ie_by_candidate"
            referencedColumns: ["candidate_id"]
          },
        ]
      }
      ca_expenditures: {
        Row: {
          amend_id: number
          amount: number
          candidate_id: string | null
          committee_filer_id: number
          created_at: string
          cumulative_ytd: number | null
          cycle: string | null
          expenditure_date: string | null
          expn_code: string | null
          expn_description: string | null
          filing_id: number
          id: string
          payee_city: string | null
          payee_first_name: string | null
          payee_last_name: string | null
          payee_state: string | null
          payee_zip: string | null
          source_form_type: string | null
          tran_id: string
          updated_at: string
        }
        Insert: {
          amend_id: number
          amount: number
          candidate_id?: string | null
          committee_filer_id: number
          created_at?: string
          cumulative_ytd?: number | null
          cycle?: string | null
          expenditure_date?: string | null
          expn_code?: string | null
          expn_description?: string | null
          filing_id: number
          id?: string
          payee_city?: string | null
          payee_first_name?: string | null
          payee_last_name?: string | null
          payee_state?: string | null
          payee_zip?: string | null
          source_form_type?: string | null
          tran_id: string
          updated_at?: string
        }
        Update: {
          amend_id?: number
          amount?: number
          candidate_id?: string | null
          committee_filer_id?: number
          created_at?: string
          cumulative_ytd?: number | null
          cycle?: string | null
          expenditure_date?: string | null
          expn_code?: string | null
          expn_description?: string | null
          filing_id?: number
          id?: string
          payee_city?: string | null
          payee_first_name?: string | null
          payee_last_name?: string | null
          payee_state?: string | null
          payee_zip?: string | null
          source_form_type?: string | null
          tran_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ca_expenditures_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "ca_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ca_expenditures_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "ca_contributions_summary"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "ca_expenditures_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "ca_ie_by_candidate"
            referencedColumns: ["candidate_id"]
          },
        ]
      }
      ca_filings: {
        Row: {
          amend_id: number
          cand_filer_id: number | null
          cand_first_name: string | null
          cand_last_name: string | null
          created_at: string
          elect_date: string | null
          filed_date: string | null
          filer_id: number
          filing_id: number
          form_type: string | null
          office_cd: string | null
          rpt_end: string | null
          rpt_start: string | null
          stmt_type: string | null
          sup_opp_cd: string | null
          updated_at: string
        }
        Insert: {
          amend_id: number
          cand_filer_id?: number | null
          cand_first_name?: string | null
          cand_last_name?: string | null
          created_at?: string
          elect_date?: string | null
          filed_date?: string | null
          filer_id: number
          filing_id: number
          form_type?: string | null
          office_cd?: string | null
          rpt_end?: string | null
          rpt_start?: string | null
          stmt_type?: string | null
          sup_opp_cd?: string | null
          updated_at?: string
        }
        Update: {
          amend_id?: number
          cand_filer_id?: number | null
          cand_first_name?: string | null
          cand_last_name?: string | null
          created_at?: string
          elect_date?: string | null
          filed_date?: string | null
          filer_id?: number
          filing_id?: number
          form_type?: string | null
          office_cd?: string | null
          rpt_end?: string | null
          rpt_start?: string | null
          stmt_type?: string | null
          sup_opp_cd?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ca_ie_committees: {
        Row: {
          city: string | null
          created_at: string
          filer_id: number
          filer_type: string | null
          name: string
          party_affiliation: string | null
          sponsor: string | null
          state: string | null
          status: string | null
          updated_at: string
          zip: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          filer_id: number
          filer_type?: string | null
          name: string
          party_affiliation?: string | null
          sponsor?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
          zip?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          filer_id?: number
          filer_type?: string | null
          name?: string
          party_affiliation?: string | null
          sponsor?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
          zip?: string | null
        }
        Relationships: []
      }
      ca_independent_expenditures: {
        Row: {
          amend_id: number
          amount: number
          created_at: string
          cycle: string | null
          description: string | null
          expenditure_date: string | null
          filing_id: number
          id: string
          ie_committee_filer_id: number | null
          source_form_type: string | null
          support_oppose: string | null
          target_candidate_id: string | null
          tran_id: string
          updated_at: string
        }
        Insert: {
          amend_id: number
          amount: number
          created_at?: string
          cycle?: string | null
          description?: string | null
          expenditure_date?: string | null
          filing_id: number
          id?: string
          ie_committee_filer_id?: number | null
          source_form_type?: string | null
          support_oppose?: string | null
          target_candidate_id?: string | null
          tran_id: string
          updated_at?: string
        }
        Update: {
          amend_id?: number
          amount?: number
          created_at?: string
          cycle?: string | null
          description?: string | null
          expenditure_date?: string | null
          filing_id?: number
          id?: string
          ie_committee_filer_id?: number | null
          source_form_type?: string | null
          support_oppose?: string | null
          target_candidate_id?: string | null
          tran_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ca_independent_expenditures_ie_committee_filer_id_fkey"
            columns: ["ie_committee_filer_id"]
            isOneToOne: false
            referencedRelation: "ca_ie_committees"
            referencedColumns: ["filer_id"]
          },
          {
            foreignKeyName: "ca_independent_expenditures_target_candidate_id_fkey"
            columns: ["target_candidate_id"]
            isOneToOne: false
            referencedRelation: "ca_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ca_independent_expenditures_target_candidate_id_fkey"
            columns: ["target_candidate_id"]
            isOneToOne: false
            referencedRelation: "ca_contributions_summary"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "ca_independent_expenditures_target_candidate_id_fkey"
            columns: ["target_candidate_id"]
            isOneToOne: false
            referencedRelation: "ca_ie_by_candidate"
            referencedColumns: ["candidate_id"]
          },
        ]
      }
      cabinet_members: {
        Row: {
          cabinet_id: string
          created_at: string
          epstein_link: string | null
          executive_level: string | null
          headshot_url: string | null
          id: number
          name: string | null
          position: string | null
          position_description: string | null
          salary: number | null
        }
        Insert: {
          cabinet_id?: string
          created_at?: string
          epstein_link?: string | null
          executive_level?: string | null
          headshot_url?: string | null
          id?: number
          name?: string | null
          position?: string | null
          position_description?: string | null
          salary?: number | null
        }
        Update: {
          cabinet_id?: string
          created_at?: string
          epstein_link?: string | null
          executive_level?: string | null
          headshot_url?: string | null
          id?: number
          name?: string | null
          position?: string | null
          position_description?: string | null
          salary?: number | null
        }
        Relationships: []
      }
      cabinet_trades: {
        Row: {
          amount: string | null
          amount_average: number | null
          asset_type: string | null
          cabinet_id: string | null
          created_at: string | null
          description: string | null
          disclosure_date: string | null
          id: string
          notification_date: string | null
          owner: string | null
          position: string | null
          representative: string
          source_pdf_url: string | null
          ticker: string | null
          transaction_date: string
          transaction_type: string | null
        }
        Insert: {
          amount?: string | null
          amount_average?: number | null
          asset_type?: string | null
          cabinet_id?: string | null
          created_at?: string | null
          description?: string | null
          disclosure_date?: string | null
          id?: string
          notification_date?: string | null
          owner?: string | null
          position?: string | null
          representative: string
          source_pdf_url?: string | null
          ticker?: string | null
          transaction_date: string
          transaction_type?: string | null
        }
        Update: {
          amount?: string | null
          amount_average?: number | null
          asset_type?: string | null
          cabinet_id?: string | null
          created_at?: string | null
          description?: string | null
          disclosure_date?: string | null
          id?: string
          notification_date?: string | null
          owner?: string | null
          position?: string | null
          representative?: string
          source_pdf_url?: string | null
          ticker?: string | null
          transaction_date?: string
          transaction_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cabinet_trades_cabinet_id_fkey"
            columns: ["cabinet_id"]
            isOneToOne: false
            referencedRelation: "cabinet_member_summary"
            referencedColumns: ["cabinet_id"]
          },
          {
            foreignKeyName: "cabinet_trades_cabinet_id_fkey"
            columns: ["cabinet_id"]
            isOneToOne: false
            referencedRelation: "cabinet_members"
            referencedColumns: ["cabinet_id"]
          },
        ]
      }
      candidate_disclosure_staging: {
        Row: {
          asset_name: string | null
          asset_type_raw: string | null
          extracted_at: string | null
          filed_date: string | null
          filer_chamber: string | null
          filer_district: string | null
          filer_name: string | null
          filer_state: string | null
          filing_date: string | null
          filing_year: number | null
          income: string | null
          income_type: string | null
          owner_raw: string | null
          report_id: string | null
          report_link: string | null
          source: string | null
          value_raw: string | null
        }
        Insert: {
          asset_name?: string | null
          asset_type_raw?: string | null
          extracted_at?: string | null
          filed_date?: string | null
          filer_chamber?: string | null
          filer_district?: string | null
          filer_name?: string | null
          filer_state?: string | null
          filing_date?: string | null
          filing_year?: number | null
          income?: string | null
          income_type?: string | null
          owner_raw?: string | null
          report_id?: string | null
          report_link?: string | null
          source?: string | null
          value_raw?: string | null
        }
        Update: {
          asset_name?: string | null
          asset_type_raw?: string | null
          extracted_at?: string | null
          filed_date?: string | null
          filer_chamber?: string | null
          filer_district?: string | null
          filer_name?: string | null
          filer_state?: string | null
          filing_date?: string | null
          filing_year?: number | null
          income?: string | null
          income_type?: string | null
          owner_raw?: string | null
          report_id?: string | null
          report_link?: string | null
          source?: string | null
          value_raw?: string | null
        }
        Relationships: []
      }
      candidate_disclosure_staging_updated: {
        Row: {
          asset_name: string | null
          asset_type_raw: string | null
          extracted_at: string | null
          filed_date: string | null
          filer_chamber: string | null
          filer_district: string | null
          filer_name: string | null
          filer_state: string | null
          filing_date: string | null
          filing_year: string | null
          income: string | null
          income_type: string | null
          owner_raw: string | null
          report_id: string | null
          report_link: string | null
          source: string | null
          value_raw: string | null
        }
        Insert: {
          asset_name?: string | null
          asset_type_raw?: string | null
          extracted_at?: string | null
          filed_date?: string | null
          filer_chamber?: string | null
          filer_district?: string | null
          filer_name?: string | null
          filer_state?: string | null
          filing_date?: string | null
          filing_year?: string | null
          income?: string | null
          income_type?: string | null
          owner_raw?: string | null
          report_id?: string | null
          report_link?: string | null
          source?: string | null
          value_raw?: string | null
        }
        Update: {
          asset_name?: string | null
          asset_type_raw?: string | null
          extracted_at?: string | null
          filed_date?: string | null
          filer_chamber?: string | null
          filer_district?: string | null
          filer_name?: string | null
          filer_state?: string | null
          filing_date?: string | null
          filing_year?: string | null
          income?: string | null
          income_type?: string | null
          owner_raw?: string | null
          report_id?: string | null
          report_link?: string | null
          source?: string | null
          value_raw?: string | null
        }
        Relationships: []
      }
      candidate_pending_changes: {
        Row: {
          candidate_id: string
          id: string
          original_values: Json
          proposed_changes: Json
          review_note: string | null
          reviewed_at: string | null
          status: string
          submitted_at: string
        }
        Insert: {
          candidate_id: string
          id?: string
          original_values: Json
          proposed_changes: Json
          review_note?: string | null
          reviewed_at?: string | null
          status?: string
          submitted_at?: string
        }
        Update: {
          candidate_id?: string
          id?: string
          original_values?: Json
          proposed_changes?: Json
          review_note?: string | null
          reviewed_at?: string | null
          status?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_pending_changes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_assets"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "candidate_pending_changes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_committee_fundraising"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "candidate_pending_changes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_pending_changes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "crypto_exec_candidate_totals"
            referencedColumns: ["candidate_uuid"]
          },
          {
            foreignKeyName: "candidate_pending_changes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "earmarked_by_candidate"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "candidate_pending_changes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "extension_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_pending_changes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "grade_inputs"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "candidate_pending_changes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pac_cycle_recipients"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "candidate_pending_changes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pro_israel_pac_candidate_totals"
            referencedColumns: ["candidate_id"]
          },
        ]
      }
      candidates: {
        Row: {
          address: string | null
          affiliated_committee_name: string | null
          bill_citizens_united: boolean | null
          bill_lobby_ban: boolean | null
          bill_stock_ban: boolean | null
          bioguide_id: string | null
          campaign_address: string | null
          campaign_city: string | null
          campaign_phone: string | null
          campaign_state: string | null
          campaign_zip: string | null
          candidate_status: string | null
          chamber: string | null
          citizens_united_pledge: boolean | null
          committee_1: string | null
          committee_2: string | null
          committee_3: string | null
          committee_4: string | null
          committee_5: string | null
          committee_6: string | null
          committee_7: string | null
          committee_8: string | null
          committees: string[] | null
          connected_cmte: string | null
          created_at: string | null
          district: string | null
          dont_count_stocks: boolean | null
          election_margin: string | null
          email: string | null
          facebook_user: string | null
          featured: boolean
          fec_id: string | null
          firstElected: string | null
          id: string
          incumbent_status: string | null
          instagram_id: string | null
          instagram_user: string | null
          is_duplicate: boolean | null
          lastElected: string | null
          letter_grade: string | null
          linked_candidate_id: string | null
          manualimport: boolean
          name: string
          net_worth: number | null
          next_election: number | null
          no_lobbyist_pledge: boolean | null
          no_pac_pledge: boolean | null
          no_trading_pledge: boolean | null
          numeric_grade: number | null
          officeholder_website: string | null
          party: string
          phone: string | null
          photo_url: string | null
          photo_url_large: string | null
          photo_url_medium: string | null
          photo_url_thumb: string | null
          pip_pledge_tier: number | null
          pip_pledges: boolean | null
          race_id: string | null
          revolving_door_pledge: boolean | null
          slug: string | null
          state: string
          status: string | null
          stocks_held: number[] | null
          stocks_traded: string[] | null
          title: string | null
          treasurer_name: string | null
          twitter_id: string | null
          twitter_user: string | null
          type: string | null
          updated_at: string | null
          website: string | null
          youtube_id: string | null
          youtube_user: string | null
        }
        Insert: {
          address?: string | null
          affiliated_committee_name?: string | null
          bill_citizens_united?: boolean | null
          bill_lobby_ban?: boolean | null
          bill_stock_ban?: boolean | null
          bioguide_id?: string | null
          campaign_address?: string | null
          campaign_city?: string | null
          campaign_phone?: string | null
          campaign_state?: string | null
          campaign_zip?: string | null
          candidate_status?: string | null
          chamber?: string | null
          citizens_united_pledge?: boolean | null
          committee_1?: string | null
          committee_2?: string | null
          committee_3?: string | null
          committee_4?: string | null
          committee_5?: string | null
          committee_6?: string | null
          committee_7?: string | null
          committee_8?: string | null
          committees?: string[] | null
          connected_cmte?: string | null
          created_at?: string | null
          district?: string | null
          dont_count_stocks?: boolean | null
          election_margin?: string | null
          email?: string | null
          facebook_user?: string | null
          featured?: boolean
          fec_id?: string | null
          firstElected?: string | null
          id?: string
          incumbent_status?: string | null
          instagram_id?: string | null
          instagram_user?: string | null
          is_duplicate?: boolean | null
          lastElected?: string | null
          letter_grade?: string | null
          linked_candidate_id?: string | null
          manualimport?: boolean
          name: string
          net_worth?: number | null
          next_election?: number | null
          no_lobbyist_pledge?: boolean | null
          no_pac_pledge?: boolean | null
          no_trading_pledge?: boolean | null
          numeric_grade?: number | null
          officeholder_website?: string | null
          party: string
          phone?: string | null
          photo_url?: string | null
          photo_url_large?: string | null
          photo_url_medium?: string | null
          photo_url_thumb?: string | null
          pip_pledge_tier?: number | null
          pip_pledges?: boolean | null
          race_id?: string | null
          revolving_door_pledge?: boolean | null
          slug?: string | null
          state: string
          status?: string | null
          stocks_held?: number[] | null
          stocks_traded?: string[] | null
          title?: string | null
          treasurer_name?: string | null
          twitter_id?: string | null
          twitter_user?: string | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
          youtube_id?: string | null
          youtube_user?: string | null
        }
        Update: {
          address?: string | null
          affiliated_committee_name?: string | null
          bill_citizens_united?: boolean | null
          bill_lobby_ban?: boolean | null
          bill_stock_ban?: boolean | null
          bioguide_id?: string | null
          campaign_address?: string | null
          campaign_city?: string | null
          campaign_phone?: string | null
          campaign_state?: string | null
          campaign_zip?: string | null
          candidate_status?: string | null
          chamber?: string | null
          citizens_united_pledge?: boolean | null
          committee_1?: string | null
          committee_2?: string | null
          committee_3?: string | null
          committee_4?: string | null
          committee_5?: string | null
          committee_6?: string | null
          committee_7?: string | null
          committee_8?: string | null
          committees?: string[] | null
          connected_cmte?: string | null
          created_at?: string | null
          district?: string | null
          dont_count_stocks?: boolean | null
          election_margin?: string | null
          email?: string | null
          facebook_user?: string | null
          featured?: boolean
          fec_id?: string | null
          firstElected?: string | null
          id?: string
          incumbent_status?: string | null
          instagram_id?: string | null
          instagram_user?: string | null
          is_duplicate?: boolean | null
          lastElected?: string | null
          letter_grade?: string | null
          linked_candidate_id?: string | null
          manualimport?: boolean
          name?: string
          net_worth?: number | null
          next_election?: number | null
          no_lobbyist_pledge?: boolean | null
          no_pac_pledge?: boolean | null
          no_trading_pledge?: boolean | null
          numeric_grade?: number | null
          officeholder_website?: string | null
          party?: string
          phone?: string | null
          photo_url?: string | null
          photo_url_large?: string | null
          photo_url_medium?: string | null
          photo_url_thumb?: string | null
          pip_pledge_tier?: number | null
          pip_pledges?: boolean | null
          race_id?: string | null
          revolving_door_pledge?: boolean | null
          slug?: string | null
          state?: string
          status?: string | null
          stocks_held?: number[] | null
          stocks_traded?: string[] | null
          title?: string | null
          treasurer_name?: string | null
          twitter_id?: string | null
          twitter_user?: string | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
          youtube_id?: string | null
          youtube_user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_committee_1_fkey"
            columns: ["committee_1"]
            isOneToOne: false
            referencedRelation: "committee_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidates_committee_2_fkey"
            columns: ["committee_2"]
            isOneToOne: false
            referencedRelation: "committee_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidates_committee_3_fkey"
            columns: ["committee_3"]
            isOneToOne: false
            referencedRelation: "committee_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidates_committee_4_fkey"
            columns: ["committee_4"]
            isOneToOne: false
            referencedRelation: "committee_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidates_committee_5_fkey"
            columns: ["committee_5"]
            isOneToOne: false
            referencedRelation: "committee_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidates_committee_6_fkey"
            columns: ["committee_6"]
            isOneToOne: false
            referencedRelation: "committee_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidates_committee_7_fkey"
            columns: ["committee_7"]
            isOneToOne: false
            referencedRelation: "committee_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidates_committee_8_fkey"
            columns: ["committee_8"]
            isOneToOne: false
            referencedRelation: "committee_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidates_linked_candidate_id_fkey"
            columns: ["linked_candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_assets"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "candidates_linked_candidate_id_fkey"
            columns: ["linked_candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_committee_fundraising"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "candidates_linked_candidate_id_fkey"
            columns: ["linked_candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidates_linked_candidate_id_fkey"
            columns: ["linked_candidate_id"]
            isOneToOne: false
            referencedRelation: "crypto_exec_candidate_totals"
            referencedColumns: ["candidate_uuid"]
          },
          {
            foreignKeyName: "candidates_linked_candidate_id_fkey"
            columns: ["linked_candidate_id"]
            isOneToOne: false
            referencedRelation: "earmarked_by_candidate"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "candidates_linked_candidate_id_fkey"
            columns: ["linked_candidate_id"]
            isOneToOne: false
            referencedRelation: "extension_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidates_linked_candidate_id_fkey"
            columns: ["linked_candidate_id"]
            isOneToOne: false
            referencedRelation: "grade_inputs"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "candidates_linked_candidate_id_fkey"
            columns: ["linked_candidate_id"]
            isOneToOne: false
            referencedRelation: "pac_cycle_recipients"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "candidates_linked_candidate_id_fkey"
            columns: ["linked_candidate_id"]
            isOneToOne: false
            referencedRelation: "pro_israel_pac_candidate_totals"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "candidates_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["race_id"]
          },
        ]
      }
      candidates_photo_backup: {
        Row: {
          id: string | null
          photo_url: string | null
          photo_url_large: string | null
          photo_url_medium: string | null
          photo_url_thumb: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string | null
          photo_url?: string | null
          photo_url_large?: string | null
          photo_url_medium?: string | null
          photo_url_thumb?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string | null
          photo_url?: string | null
          photo_url_large?: string | null
          photo_url_medium?: string | null
          photo_url_thumb?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      committee_master: {
        Row: {
          created_at: string | null
          established: string | null
          id: string
          jurisdiction: string | null
          jurisdiction_source: string | null
          name: string
          thomas_id: string | null
          type: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          established?: string | null
          id?: string
          jurisdiction?: string | null
          jurisdiction_source?: string | null
          name: string
          thomas_id?: string | null
          type?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          established?: string | null
          id?: string
          jurisdiction?: string | null
          jurisdiction_source?: string | null
          name?: string
          thomas_id?: string | null
          type?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      committee_totals_master: {
        Row: {
          all_other_loans: number | null
          candidate_contribution: number | null
          candidate_id: string | null
          cash_on_hand_beginning_period: number | null
          committee_designation: string | null
          committee_designation_full: string | null
          committee_id: string
          committee_name: string | null
          committee_state: string | null
          committee_type: string | null
          committee_type_full: string | null
          contribution_refunds: number | null
          contributions: number | null
          coverage_end_date: string | null
          coverage_start_date: string | null
          created_at: string | null
          cycle: number
          disbursements: number | null
          filing_frequency: string | null
          filing_frequency_full: string | null
          first_f1_date: string | null
          first_file_date: string | null
          id: string
          individual_contributions: number | null
          individual_itemized_contributions: number | null
          individual_unitemized_contributions: number | null
          last_beginning_image_number: string | null
          last_cash_on_hand_end_period: number | null
          last_debts_owed_by_committee: number | null
          last_debts_owed_to_committee: number | null
          last_report_type_full: string | null
          last_report_year: number | null
          loan_repayments: number | null
          loan_repayments_candidate_loans: number | null
          loan_repayments_other_loans: number | null
          loans: number | null
          loans_made_by_candidate: number | null
          net_contributions: number | null
          net_operating_expenditures: number | null
          offsets_to_operating_expenditures: number | null
          operating_expenditures: number | null
          organization_type: string | null
          organization_type_full: string | null
          other_disbursements: number | null
          other_political_committee_contributions: number | null
          other_receipts: number | null
          party_full: string | null
          political_party_committee_contributions: number | null
          receipts: number | null
          refunded_individual_contributions: number | null
          refunded_other_political_committee_contributions: number | null
          refunded_political_party_committee_contributions: number | null
          transaction_coverage_date: string | null
          transfers_from_other_authorized_committee: number | null
          transfers_to_other_authorized_committee: number | null
          treasurer_name: string | null
          updated_at: string | null
        }
        Insert: {
          all_other_loans?: number | null
          candidate_contribution?: number | null
          candidate_id?: string | null
          cash_on_hand_beginning_period?: number | null
          committee_designation?: string | null
          committee_designation_full?: string | null
          committee_id: string
          committee_name?: string | null
          committee_state?: string | null
          committee_type?: string | null
          committee_type_full?: string | null
          contribution_refunds?: number | null
          contributions?: number | null
          coverage_end_date?: string | null
          coverage_start_date?: string | null
          created_at?: string | null
          cycle: number
          disbursements?: number | null
          filing_frequency?: string | null
          filing_frequency_full?: string | null
          first_f1_date?: string | null
          first_file_date?: string | null
          id?: string
          individual_contributions?: number | null
          individual_itemized_contributions?: number | null
          individual_unitemized_contributions?: number | null
          last_beginning_image_number?: string | null
          last_cash_on_hand_end_period?: number | null
          last_debts_owed_by_committee?: number | null
          last_debts_owed_to_committee?: number | null
          last_report_type_full?: string | null
          last_report_year?: number | null
          loan_repayments?: number | null
          loan_repayments_candidate_loans?: number | null
          loan_repayments_other_loans?: number | null
          loans?: number | null
          loans_made_by_candidate?: number | null
          net_contributions?: number | null
          net_operating_expenditures?: number | null
          offsets_to_operating_expenditures?: number | null
          operating_expenditures?: number | null
          organization_type?: string | null
          organization_type_full?: string | null
          other_disbursements?: number | null
          other_political_committee_contributions?: number | null
          other_receipts?: number | null
          party_full?: string | null
          political_party_committee_contributions?: number | null
          receipts?: number | null
          refunded_individual_contributions?: number | null
          refunded_other_political_committee_contributions?: number | null
          refunded_political_party_committee_contributions?: number | null
          transaction_coverage_date?: string | null
          transfers_from_other_authorized_committee?: number | null
          transfers_to_other_authorized_committee?: number | null
          treasurer_name?: string | null
          updated_at?: string | null
        }
        Update: {
          all_other_loans?: number | null
          candidate_contribution?: number | null
          candidate_id?: string | null
          cash_on_hand_beginning_period?: number | null
          committee_designation?: string | null
          committee_designation_full?: string | null
          committee_id?: string
          committee_name?: string | null
          committee_state?: string | null
          committee_type?: string | null
          committee_type_full?: string | null
          contribution_refunds?: number | null
          contributions?: number | null
          coverage_end_date?: string | null
          coverage_start_date?: string | null
          created_at?: string | null
          cycle?: number
          disbursements?: number | null
          filing_frequency?: string | null
          filing_frequency_full?: string | null
          first_f1_date?: string | null
          first_file_date?: string | null
          id?: string
          individual_contributions?: number | null
          individual_itemized_contributions?: number | null
          individual_unitemized_contributions?: number | null
          last_beginning_image_number?: string | null
          last_cash_on_hand_end_period?: number | null
          last_debts_owed_by_committee?: number | null
          last_debts_owed_to_committee?: number | null
          last_report_type_full?: string | null
          last_report_year?: number | null
          loan_repayments?: number | null
          loan_repayments_candidate_loans?: number | null
          loan_repayments_other_loans?: number | null
          loans?: number | null
          loans_made_by_candidate?: number | null
          net_contributions?: number | null
          net_operating_expenditures?: number | null
          offsets_to_operating_expenditures?: number | null
          operating_expenditures?: number | null
          organization_type?: string | null
          organization_type_full?: string | null
          other_disbursements?: number | null
          other_political_committee_contributions?: number | null
          other_receipts?: number | null
          party_full?: string | null
          political_party_committee_contributions?: number | null
          receipts?: number | null
          refunded_individual_contributions?: number | null
          refunded_other_political_committee_contributions?: number | null
          refunded_political_party_committee_contributions?: number | null
          transaction_coverage_date?: string | null
          transfers_from_other_authorized_committee?: number | null
          transfers_to_other_authorized_committee?: number | null
          treasurer_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_committee_totals_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_assets"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_committee_totals_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_committee_fundraising"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_committee_totals_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_committee_totals_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "crypto_exec_candidate_totals"
            referencedColumns: ["candidate_uuid"]
          },
          {
            foreignKeyName: "fk_committee_totals_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "earmarked_by_candidate"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_committee_totals_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "extension_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_committee_totals_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "grade_inputs"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_committee_totals_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pac_cycle_recipients"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_committee_totals_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pro_israel_pac_candidate_totals"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_committee_totals_committee"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "pac_contributions_by_year"
            referencedColumns: ["pac_id"]
          },
          {
            foreignKeyName: "fk_committee_totals_committee"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "pac_master"
            referencedColumns: ["cmte_id"]
          },
        ]
      }
      companies: {
        Row: {
          cik: string | null
          created_at: string | null
          headquarters_city: string | null
          headquarters_state: string | null
          id: string
          industry: string | null
          littlesis_id: number | null
          name: string
          name_normalized: string | null
          parent_company_id: string | null
          sector: string | null
          ticker: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          cik?: string | null
          created_at?: string | null
          headquarters_city?: string | null
          headquarters_state?: string | null
          id?: string
          industry?: string | null
          littlesis_id?: number | null
          name: string
          name_normalized?: string | null
          parent_company_id?: string | null
          sector?: string | null
          ticker?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          cik?: string | null
          created_at?: string | null
          headquarters_city?: string | null
          headquarters_state?: string | null
          id?: string
          industry?: string | null
          littlesis_id?: number | null
          name?: string
          name_normalized?: string | null
          parent_company_id?: string | null
          sector?: string | null
          ticker?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "company_board_members_detail"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "companies_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "company_pac_stockholders"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "companies_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "company_pacs_detail"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "companies_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "company_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "company_stockholders_detail"
            referencedColumns: ["company_id"]
          },
        ]
      }
      company_aliases: {
        Row: {
          alias: string
          alias_normalized: string
          company_id: string | null
          created_at: string | null
          id: string
          source: string | null
        }
        Insert: {
          alias: string
          alias_normalized: string
          company_id?: string | null
          created_at?: string | null
          id?: string
          source?: string | null
        }
        Update: {
          alias?: string
          alias_normalized?: string
          company_id?: string | null
          created_at?: string | null
          id?: string
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_aliases_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_aliases_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_board_members_detail"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_aliases_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_pac_stockholders"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_aliases_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_pacs_detail"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_aliases_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_aliases_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_stockholders_detail"
            referencedColumns: ["company_id"]
          },
        ]
      }
      company_board_members: {
        Row: {
          candidate_id: string | null
          company_id: string | null
          created_at: string | null
          from_date: string | null
          id: string
          is_current: boolean | null
          littlesis_person_id: number | null
          position_title: string | null
          source: string | null
          source_id: string | null
          to_date: string | null
        }
        Insert: {
          candidate_id?: string | null
          company_id?: string | null
          created_at?: string | null
          from_date?: string | null
          id?: string
          is_current?: boolean | null
          littlesis_person_id?: number | null
          position_title?: string | null
          source?: string | null
          source_id?: string | null
          to_date?: string | null
        }
        Update: {
          candidate_id?: string | null
          company_id?: string | null
          created_at?: string | null
          from_date?: string | null
          id?: string
          is_current?: boolean | null
          littlesis_person_id?: number | null
          position_title?: string | null
          source?: string | null
          source_id?: string | null
          to_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_board_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_board_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_board_members_detail"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_board_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_pac_stockholders"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_board_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_pacs_detail"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_board_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_board_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_stockholders_detail"
            referencedColumns: ["company_id"]
          },
        ]
      }
      company_pacs: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          pac_cmte_id: string | null
          relationship_type: string | null
          source: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          pac_cmte_id?: string | null
          relationship_type?: string | null
          source?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          pac_cmte_id?: string | null
          relationship_type?: string | null
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_pacs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_pacs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_board_members_detail"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_pacs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_pac_stockholders"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_pacs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_pacs_detail"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_pacs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_pacs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_stockholders_detail"
            referencedColumns: ["company_id"]
          },
        ]
      }
      company_relationships: {
        Row: {
          amount: number | null
          company_id: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          littlesis_category_id: number | null
          littlesis_relationship_id: number | null
          related_entity_id: number | null
          related_entity_name: string | null
          related_entity_type: string | null
          relationship_type: string | null
          start_date: string | null
        }
        Insert: {
          amount?: number | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          littlesis_category_id?: number | null
          littlesis_relationship_id?: number | null
          related_entity_id?: number | null
          related_entity_name?: string | null
          related_entity_type?: string | null
          relationship_type?: string | null
          start_date?: string | null
        }
        Update: {
          amount?: number | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          littlesis_category_id?: number | null
          littlesis_relationship_id?: number | null
          related_entity_id?: number | null
          related_entity_name?: string | null
          related_entity_type?: string | null
          relationship_type?: string | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_relationships_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_relationships_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_board_members_detail"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_relationships_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_pac_stockholders"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_relationships_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_pacs_detail"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_relationships_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_relationships_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_stockholders_detail"
            referencedColumns: ["company_id"]
          },
        ]
      }
      company_stockholders: {
        Row: {
          candidate_id: string | null
          company_id: string | null
          created_at: string | null
          filing_year: number | null
          id: string
          source: string | null
          source_id: string | null
          value_max: number | null
          value_min: number | null
        }
        Insert: {
          candidate_id?: string | null
          company_id?: string | null
          created_at?: string | null
          filing_year?: number | null
          id?: string
          source?: string | null
          source_id?: string | null
          value_max?: number | null
          value_min?: number | null
        }
        Update: {
          candidate_id?: string | null
          company_id?: string | null
          created_at?: string | null
          filing_year?: number | null
          id?: string
          source?: string | null
          source_id?: string | null
          value_max?: number | null
          value_min?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "company_stockholders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_stockholders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_board_members_detail"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_stockholders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_pac_stockholders"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_stockholders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_pacs_detail"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_stockholders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_stockholders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_stockholders_detail"
            referencedColumns: ["company_id"]
          },
        ]
      }
      congress_gov_cache: {
        Row: {
          cache_key: string
          data: Json
          expires_at: string
          fetched_at: string
          id: string
        }
        Insert: {
          cache_key: string
          data: Json
          expires_at?: string
          fetched_at?: string
          id?: string
        }
        Update: {
          cache_key?: string
          data?: Json
          expires_at?: string
          fetched_at?: string
          id?: string
        }
        Relationships: []
      }
      congress_trades: {
        Row: {
          amount: string | null
          bioguide_id: string | null
          chamber: string | null
          created_at: string | null
          description: string | null
          disclosure_date: string | null
          district: string | null
          expires_at: string | null
          id: string
          option_type: string | null
          party: string | null
          representative: string
          state: string | null
          strike_price: string | null
          ticker: string
          transaction_date: string
          transaction_type: string | null
        }
        Insert: {
          amount?: string | null
          bioguide_id?: string | null
          chamber?: string | null
          created_at?: string | null
          description?: string | null
          disclosure_date?: string | null
          district?: string | null
          expires_at?: string | null
          id?: string
          option_type?: string | null
          party?: string | null
          representative: string
          state?: string | null
          strike_price?: string | null
          ticker: string
          transaction_date: string
          transaction_type?: string | null
        }
        Update: {
          amount?: string | null
          bioguide_id?: string | null
          chamber?: string | null
          created_at?: string | null
          description?: string | null
          disclosure_date?: string | null
          district?: string | null
          expires_at?: string | null
          id?: string
          option_type?: string | null
          party?: string | null
          representative?: string
          state?: string | null
          strike_price?: string | null
          ticker?: string
          transaction_date?: string
          transaction_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "congress_trades_bioguide_id_fkey"
            columns: ["bioguide_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["bioguide_id"]
          },
        ]
      }
      contribution_data: {
        Row: {
          candidate_id: string | null
          cmte_transfers: number | null
          cooperative_pacs: number | null
          corporate_pacs: number | null
          created_at: string
          id: string
          individual_in_state: number | null
          individual_out_of_state: number | null
          individual_raised: number | null
          lg_dollar_raised: number | null
          lobbyist_raised: number | null
          max_coop_pacs: string | null
          max_corporate_pacs: string | null
          max_labor_pac: string | null
          max_labor_pacs: string | null
          max_member_pacs: string | null
          max_no_stock_pacs: string | null
          max_trade_pacs: string | null
          max_unknown_orgs: string | null
          med_dollar_raised: number | null
          membership_pacs: number | null
          no_stock_pacs: string | null
          pac_raised: number | null
          self_raised: number | null
          small_dollar_raised: number | null
          top_coop_pacs: string | null
          top_corporate_pacs: string | null
          top_labor_pacs: string | null
          top_member_pacs: string | null
          top_no_stock_pacs: string | null
          top_pacs: string | null
          top_trade_pacs: string | null
          top_unknown_orgs: string | null
          total_in_district: number | null
          total_raised: number | null
          trade_pacs: number | null
          union_pacs: number | null
          unknown_orgs: number | null
          updated_at: string
          year: number
        }
        Insert: {
          candidate_id?: string | null
          cmte_transfers?: number | null
          cooperative_pacs?: number | null
          corporate_pacs?: number | null
          created_at?: string
          id?: string
          individual_in_state?: number | null
          individual_out_of_state?: number | null
          individual_raised?: number | null
          lg_dollar_raised?: number | null
          lobbyist_raised?: number | null
          max_coop_pacs?: string | null
          max_corporate_pacs?: string | null
          max_labor_pac?: string | null
          max_labor_pacs?: string | null
          max_member_pacs?: string | null
          max_no_stock_pacs?: string | null
          max_trade_pacs?: string | null
          max_unknown_orgs?: string | null
          med_dollar_raised?: number | null
          membership_pacs?: number | null
          no_stock_pacs?: string | null
          pac_raised?: number | null
          self_raised?: number | null
          small_dollar_raised?: number | null
          top_coop_pacs?: string | null
          top_corporate_pacs?: string | null
          top_labor_pacs?: string | null
          top_member_pacs?: string | null
          top_no_stock_pacs?: string | null
          top_pacs?: string | null
          top_trade_pacs?: string | null
          top_unknown_orgs?: string | null
          total_in_district?: number | null
          total_raised?: number | null
          trade_pacs?: number | null
          union_pacs?: number | null
          unknown_orgs?: number | null
          updated_at?: string
          year: number
        }
        Update: {
          candidate_id?: string | null
          cmte_transfers?: number | null
          cooperative_pacs?: number | null
          corporate_pacs?: number | null
          created_at?: string
          id?: string
          individual_in_state?: number | null
          individual_out_of_state?: number | null
          individual_raised?: number | null
          lg_dollar_raised?: number | null
          lobbyist_raised?: number | null
          max_coop_pacs?: string | null
          max_corporate_pacs?: string | null
          max_labor_pac?: string | null
          max_labor_pacs?: string | null
          max_member_pacs?: string | null
          max_no_stock_pacs?: string | null
          max_trade_pacs?: string | null
          max_unknown_orgs?: string | null
          med_dollar_raised?: number | null
          membership_pacs?: number | null
          no_stock_pacs?: string | null
          pac_raised?: number | null
          self_raised?: number | null
          small_dollar_raised?: number | null
          top_coop_pacs?: string | null
          top_corporate_pacs?: string | null
          top_labor_pacs?: string | null
          top_member_pacs?: string | null
          top_no_stock_pacs?: string | null
          top_pacs?: string | null
          top_trade_pacs?: string | null
          top_unknown_orgs?: string | null
          total_in_district?: number | null
          total_raised?: number | null
          trade_pacs?: number | null
          union_pacs?: number | null
          unknown_orgs?: number | null
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "contribution_data_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_assets"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contribution_data_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_committee_fundraising"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contribution_data_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contribution_data_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "crypto_exec_candidate_totals"
            referencedColumns: ["candidate_uuid"]
          },
          {
            foreignKeyName: "contribution_data_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "earmarked_by_candidate"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contribution_data_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "extension_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contribution_data_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "grade_inputs"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contribution_data_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pac_cycle_recipients"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contribution_data_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pro_israel_pac_candidate_totals"
            referencedColumns: ["candidate_id"]
          },
        ]
      }
      contribution_size_master: {
        Row: {
          candidate_id: string | null
          candidate_uuid: string | null
          committee_id: string | null
          count: number | null
          created_at: string | null
          cycle: number
          id: string
          size: number
          total: number | null
        }
        Insert: {
          candidate_id?: string | null
          candidate_uuid?: string | null
          committee_id?: string | null
          count?: number | null
          created_at?: string | null
          cycle: number
          id?: string
          size: number
          total?: number | null
        }
        Update: {
          candidate_id?: string | null
          candidate_uuid?: string | null
          committee_id?: string | null
          count?: number | null
          created_at?: string | null
          cycle?: number
          id?: string
          size?: number
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_contribution_size_candidate"
            columns: ["candidate_uuid"]
            isOneToOne: false
            referencedRelation: "candidate_assets"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_contribution_size_candidate"
            columns: ["candidate_uuid"]
            isOneToOne: false
            referencedRelation: "candidate_committee_fundraising"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_contribution_size_candidate"
            columns: ["candidate_uuid"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contribution_size_candidate"
            columns: ["candidate_uuid"]
            isOneToOne: false
            referencedRelation: "crypto_exec_candidate_totals"
            referencedColumns: ["candidate_uuid"]
          },
          {
            foreignKeyName: "fk_contribution_size_candidate"
            columns: ["candidate_uuid"]
            isOneToOne: false
            referencedRelation: "earmarked_by_candidate"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_contribution_size_candidate"
            columns: ["candidate_uuid"]
            isOneToOne: false
            referencedRelation: "extension_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contribution_size_candidate"
            columns: ["candidate_uuid"]
            isOneToOne: false
            referencedRelation: "grade_inputs"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_contribution_size_candidate"
            columns: ["candidate_uuid"]
            isOneToOne: false
            referencedRelation: "pac_cycle_recipients"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_contribution_size_candidate"
            columns: ["candidate_uuid"]
            isOneToOne: false
            referencedRelation: "pro_israel_pac_candidate_totals"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_contribution_size_committee"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "pac_contributions_by_year"
            referencedColumns: ["pac_id"]
          },
          {
            foreignKeyName: "fk_contribution_size_committee"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "pac_master"
            referencedColumns: ["cmte_id"]
          },
        ]
      }
      contribution_summary_updated: {
        Row: {
          all_other_loans: number | null
          bioguideid: string | null
          candidate_id: string | null
          cmte_transfers: number | null
          committee_id: string | null
          committee_name: string | null
          committee_type: string | null
          committee_type_full: string | null
          contribution_refunds: number | null
          contributions: number | null
          created_at: string | null
          disbursements: number | null
          district: string | null
          id: string
          individual_itemized_contributions: number | null
          individual_raised: number | null
          last_debts_owed_by_committee: number | null
          last_debts_owed_to_committee: number | null
          loan_repayments: number | null
          loan_repayments_candidate_loans: number | null
          loan_repayments_other_loans: number | null
          loans: number | null
          loans_made_by_candidate: number | null
          name: string | null
          net_contributions: number | null
          other_receipts: number | null
          pac_raised: number | null
          partyname: string | null
          political_party_committee_contributions: number | null
          refunded_individual_contributions: number | null
          refunded_other_political_committee_contributions: number | null
          refunded_political_party_committee_contributions: number | null
          self_raised: number | null
          small_dollar_raised: number | null
          state: string | null
          total_raised: number | null
          transfers_to_other_authorized_committee: number | null
          year: number | null
        }
        Insert: {
          all_other_loans?: number | null
          bioguideid?: string | null
          candidate_id?: string | null
          cmte_transfers?: number | null
          committee_id?: string | null
          committee_name?: string | null
          committee_type?: string | null
          committee_type_full?: string | null
          contribution_refunds?: number | null
          contributions?: number | null
          created_at?: string | null
          disbursements?: number | null
          district?: string | null
          id?: string
          individual_itemized_contributions?: number | null
          individual_raised?: number | null
          last_debts_owed_by_committee?: number | null
          last_debts_owed_to_committee?: number | null
          loan_repayments?: number | null
          loan_repayments_candidate_loans?: number | null
          loan_repayments_other_loans?: number | null
          loans?: number | null
          loans_made_by_candidate?: number | null
          name?: string | null
          net_contributions?: number | null
          other_receipts?: number | null
          pac_raised?: number | null
          partyname?: string | null
          political_party_committee_contributions?: number | null
          refunded_individual_contributions?: number | null
          refunded_other_political_committee_contributions?: number | null
          refunded_political_party_committee_contributions?: number | null
          self_raised?: number | null
          small_dollar_raised?: number | null
          state?: string | null
          total_raised?: number | null
          transfers_to_other_authorized_committee?: number | null
          year?: number | null
        }
        Update: {
          all_other_loans?: number | null
          bioguideid?: string | null
          candidate_id?: string | null
          cmte_transfers?: number | null
          committee_id?: string | null
          committee_name?: string | null
          committee_type?: string | null
          committee_type_full?: string | null
          contribution_refunds?: number | null
          contributions?: number | null
          created_at?: string | null
          disbursements?: number | null
          district?: string | null
          id?: string
          individual_itemized_contributions?: number | null
          individual_raised?: number | null
          last_debts_owed_by_committee?: number | null
          last_debts_owed_to_committee?: number | null
          loan_repayments?: number | null
          loan_repayments_candidate_loans?: number | null
          loan_repayments_other_loans?: number | null
          loans?: number | null
          loans_made_by_candidate?: number | null
          name?: string | null
          net_contributions?: number | null
          other_receipts?: number | null
          pac_raised?: number | null
          partyname?: string | null
          political_party_committee_contributions?: number | null
          refunded_individual_contributions?: number | null
          refunded_other_political_committee_contributions?: number | null
          refunded_political_party_committee_contributions?: number | null
          self_raised?: number | null
          small_dollar_raised?: number | null
          state?: string | null
          total_raised?: number | null
          transfers_to_other_authorized_committee?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contribution_summary_updated_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_assets"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contribution_summary_updated_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_committee_fundraising"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contribution_summary_updated_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contribution_summary_updated_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "crypto_exec_candidate_totals"
            referencedColumns: ["candidate_uuid"]
          },
          {
            foreignKeyName: "contribution_summary_updated_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "earmarked_by_candidate"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contribution_summary_updated_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "extension_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contribution_summary_updated_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "grade_inputs"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contribution_summary_updated_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pac_cycle_recipients"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contribution_summary_updated_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pro_israel_pac_candidate_totals"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_contribution_summary_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_assets"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_contribution_summary_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_committee_fundraising"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_contribution_summary_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contribution_summary_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "crypto_exec_candidate_totals"
            referencedColumns: ["candidate_uuid"]
          },
          {
            foreignKeyName: "fk_contribution_summary_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "earmarked_by_candidate"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_contribution_summary_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "extension_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contribution_summary_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "grade_inputs"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_contribution_summary_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pac_cycle_recipients"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_contribution_summary_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pro_israel_pac_candidate_totals"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_contribution_summary_committee"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "pac_contributions_by_year"
            referencedColumns: ["pac_id"]
          },
          {
            foreignKeyName: "fk_contribution_summary_committee"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "pac_master"
            referencedColumns: ["cmte_id"]
          },
        ]
      }
      contributions_geo: {
        Row: {
          candidate_id: string | null
          committee_id: string | null
          count: number | null
          created_at: string | null
          cycle: number
          id: string
          state: string
          state_full: string | null
          total: number | null
        }
        Insert: {
          candidate_id?: string | null
          committee_id?: string | null
          count?: number | null
          created_at?: string | null
          cycle: number
          id?: string
          state: string
          state_full?: string | null
          total?: number | null
        }
        Update: {
          candidate_id?: string | null
          committee_id?: string | null
          count?: number | null
          created_at?: string | null
          cycle?: number
          id?: string
          state?: string
          state_full?: string | null
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_contributions_geo_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_assets"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_contributions_geo_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_committee_fundraising"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_contributions_geo_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contributions_geo_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "crypto_exec_candidate_totals"
            referencedColumns: ["candidate_uuid"]
          },
          {
            foreignKeyName: "fk_contributions_geo_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "earmarked_by_candidate"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_contributions_geo_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "extension_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contributions_geo_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "grade_inputs"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_contributions_geo_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pac_cycle_recipients"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_contributions_geo_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pro_israel_pac_candidate_totals"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_contributions_geo_committee"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "pac_contributions_by_year"
            referencedColumns: ["pac_id"]
          },
          {
            foreignKeyName: "fk_contributions_geo_committee"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "pac_master"
            referencedColumns: ["cmte_id"]
          },
        ]
      }
      contributions_in_state: {
        Row: {
          bioguideid: string | null
          candidate_id: string | null
          committee_id: string | null
          count: number | null
          created_at: string | null
          cycle: number | null
          district: string | null
          id: string
          in_state: boolean | null
          name: string | null
          partyname: string | null
          total: number | null
          updated_at: string | null
        }
        Insert: {
          bioguideid?: string | null
          candidate_id?: string | null
          committee_id?: string | null
          count?: number | null
          created_at?: string | null
          cycle?: number | null
          district?: string | null
          id?: string
          in_state?: boolean | null
          name?: string | null
          partyname?: string | null
          total?: number | null
          updated_at?: string | null
        }
        Update: {
          bioguideid?: string | null
          candidate_id?: string | null
          committee_id?: string | null
          count?: number | null
          created_at?: string | null
          cycle?: number | null
          district?: string | null
          id?: string
          in_state?: boolean | null
          name?: string | null
          partyname?: string | null
          total?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contributions_in_state_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_assets"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contributions_in_state_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_committee_fundraising"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contributions_in_state_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contributions_in_state_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "crypto_exec_candidate_totals"
            referencedColumns: ["candidate_uuid"]
          },
          {
            foreignKeyName: "contributions_in_state_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "earmarked_by_candidate"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contributions_in_state_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "extension_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contributions_in_state_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "grade_inputs"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contributions_in_state_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pac_cycle_recipients"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contributions_in_state_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pro_israel_pac_candidate_totals"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contributions_in_state_committee_id_fkey"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "pac_contributions_by_year"
            referencedColumns: ["pac_id"]
          },
          {
            foreignKeyName: "contributions_in_state_committee_id_fkey"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "pac_master"
            referencedColumns: ["cmte_id"]
          },
        ]
      }
      contributions_size: {
        Row: {
          bioguideid: string | null
          candidate_id: string | null
          committee_id: string | null
          created_at: string | null
          cycle: number | null
          district: string | null
          id: string
          name: string | null
          partyname: string | null
          size_category: string | null
          total: number | null
          updated_at: string | null
        }
        Insert: {
          bioguideid?: string | null
          candidate_id?: string | null
          committee_id?: string | null
          created_at?: string | null
          cycle?: number | null
          district?: string | null
          id?: string
          name?: string | null
          partyname?: string | null
          size_category?: string | null
          total?: number | null
          updated_at?: string | null
        }
        Update: {
          bioguideid?: string | null
          candidate_id?: string | null
          committee_id?: string | null
          created_at?: string | null
          cycle?: number | null
          district?: string | null
          id?: string
          name?: string | null
          partyname?: string | null
          size_category?: string | null
          total?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contributions_size_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_assets"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contributions_size_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_committee_fundraising"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contributions_size_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contributions_size_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "crypto_exec_candidate_totals"
            referencedColumns: ["candidate_uuid"]
          },
          {
            foreignKeyName: "contributions_size_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "earmarked_by_candidate"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contributions_size_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "extension_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contributions_size_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "grade_inputs"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contributions_size_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pac_cycle_recipients"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contributions_size_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pro_israel_pac_candidate_totals"
            referencedColumns: ["candidate_id"]
          },
        ]
      }
      contributions_summary: {
        Row: {
          all_other_loans: number | null
          bioguideid: string | null
          candidate_id: string | null
          cash_on_hand_beginning_period: number | null
          cmte_transfers: number | null
          committee_designation: string | null
          committee_designation_full: string | null
          committee_id: string | null
          committee_name: string | null
          committee_type: string | null
          committee_type_full: string | null
          contribution_refunds: number | null
          contributions: number | null
          coverage_end_date: string | null
          coverage_start_date: string | null
          created_at: string | null
          disbursements: number | null
          district: string | null
          filing_frequency: string | null
          filing_frequency_full: string | null
          first_f1_date: string | null
          first_file_date: string | null
          id: string
          individual_itemized_contributions: number | null
          individual_raised: number | null
          individual_unitemized_contributions: number | null
          last_beginning_image_number: string | null
          last_cash_on_hand_end_period: number | null
          last_debts_owed_by_committee: number | null
          last_debts_owed_to_committee: number | null
          last_report_type_full: string | null
          last_report_year: number | null
          loan_repayments: number | null
          loan_repayments_candidate_loans: number | null
          loan_repayments_other_loans: number | null
          loans: number | null
          loans_made_by_candidate: number | null
          name: string | null
          net_contributions: number | null
          net_operating_expenditures: number | null
          offsets_to_operating_expenditures: number | null
          operating_expenditures: number | null
          organization_type: string | null
          organization_type_full: string | null
          other_disbursements: number | null
          other_receipts: number | null
          pac_raised: number | null
          partyname: string | null
          political_party_committee_contributions: number | null
          refunded_individual_contributions: number | null
          refunded_other_political_committee_contributions: number | null
          refunded_political_party_committee_contributions: number | null
          self_raised: number | null
          small_dollar_raised: number | null
          state: string | null
          total_raised: number | null
          transaction_coverage_date: string | null
          transfers_to_other_authorized_committee: number | null
          treasurer_name: string | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          all_other_loans?: number | null
          bioguideid?: string | null
          candidate_id?: string | null
          cash_on_hand_beginning_period?: number | null
          cmte_transfers?: number | null
          committee_designation?: string | null
          committee_designation_full?: string | null
          committee_id?: string | null
          committee_name?: string | null
          committee_type?: string | null
          committee_type_full?: string | null
          contribution_refunds?: number | null
          contributions?: number | null
          coverage_end_date?: string | null
          coverage_start_date?: string | null
          created_at?: string | null
          disbursements?: number | null
          district?: string | null
          filing_frequency?: string | null
          filing_frequency_full?: string | null
          first_f1_date?: string | null
          first_file_date?: string | null
          id?: string
          individual_itemized_contributions?: number | null
          individual_raised?: number | null
          individual_unitemized_contributions?: number | null
          last_beginning_image_number?: string | null
          last_cash_on_hand_end_period?: number | null
          last_debts_owed_by_committee?: number | null
          last_debts_owed_to_committee?: number | null
          last_report_type_full?: string | null
          last_report_year?: number | null
          loan_repayments?: number | null
          loan_repayments_candidate_loans?: number | null
          loan_repayments_other_loans?: number | null
          loans?: number | null
          loans_made_by_candidate?: number | null
          name?: string | null
          net_contributions?: number | null
          net_operating_expenditures?: number | null
          offsets_to_operating_expenditures?: number | null
          operating_expenditures?: number | null
          organization_type?: string | null
          organization_type_full?: string | null
          other_disbursements?: number | null
          other_receipts?: number | null
          pac_raised?: number | null
          partyname?: string | null
          political_party_committee_contributions?: number | null
          refunded_individual_contributions?: number | null
          refunded_other_political_committee_contributions?: number | null
          refunded_political_party_committee_contributions?: number | null
          self_raised?: number | null
          small_dollar_raised?: number | null
          state?: string | null
          total_raised?: number | null
          transaction_coverage_date?: string | null
          transfers_to_other_authorized_committee?: number | null
          treasurer_name?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          all_other_loans?: number | null
          bioguideid?: string | null
          candidate_id?: string | null
          cash_on_hand_beginning_period?: number | null
          cmte_transfers?: number | null
          committee_designation?: string | null
          committee_designation_full?: string | null
          committee_id?: string | null
          committee_name?: string | null
          committee_type?: string | null
          committee_type_full?: string | null
          contribution_refunds?: number | null
          contributions?: number | null
          coverage_end_date?: string | null
          coverage_start_date?: string | null
          created_at?: string | null
          disbursements?: number | null
          district?: string | null
          filing_frequency?: string | null
          filing_frequency_full?: string | null
          first_f1_date?: string | null
          first_file_date?: string | null
          id?: string
          individual_itemized_contributions?: number | null
          individual_raised?: number | null
          individual_unitemized_contributions?: number | null
          last_beginning_image_number?: string | null
          last_cash_on_hand_end_period?: number | null
          last_debts_owed_by_committee?: number | null
          last_debts_owed_to_committee?: number | null
          last_report_type_full?: string | null
          last_report_year?: number | null
          loan_repayments?: number | null
          loan_repayments_candidate_loans?: number | null
          loan_repayments_other_loans?: number | null
          loans?: number | null
          loans_made_by_candidate?: number | null
          name?: string | null
          net_contributions?: number | null
          net_operating_expenditures?: number | null
          offsets_to_operating_expenditures?: number | null
          operating_expenditures?: number | null
          organization_type?: string | null
          organization_type_full?: string | null
          other_disbursements?: number | null
          other_receipts?: number | null
          pac_raised?: number | null
          partyname?: string | null
          political_party_committee_contributions?: number | null
          refunded_individual_contributions?: number | null
          refunded_other_political_committee_contributions?: number | null
          refunded_political_party_committee_contributions?: number | null
          self_raised?: number | null
          small_dollar_raised?: number | null
          state?: string | null
          total_raised?: number | null
          transaction_coverage_date?: string | null
          transfers_to_other_authorized_committee?: number | null
          treasurer_name?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contribution_summary_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_assets"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contribution_summary_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_committee_fundraising"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contribution_summary_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contribution_summary_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "crypto_exec_candidate_totals"
            referencedColumns: ["candidate_uuid"]
          },
          {
            foreignKeyName: "contribution_summary_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "earmarked_by_candidate"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contribution_summary_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "extension_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contribution_summary_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "grade_inputs"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contribution_summary_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pac_cycle_recipients"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "contribution_summary_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pro_israel_pac_candidate_totals"
            referencedColumns: ["candidate_id"]
          },
        ]
      }
      crypto_committees: {
        Row: {
          affiliated_committee_name: string | null
          by_party: Json | null
          cash_on_hand: number | null
          committee_id: string
          committee_type: string | null
          committee_type_full: string | null
          contribution_refunds: number | null
          contributions: number | null
          description: string | null
          designation: string | null
          designation_full: string | null
          disbursements: number | null
          disbursements_by_committee: Json | null
          fec_name: string | null
          first_f1_date: string | null
          independent_expenditures: number | null
          name: string
          net_contributions: number | null
          organization_type: string | null
          organization_type_full: string | null
          receipts: number | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          affiliated_committee_name?: string | null
          by_party?: Json | null
          cash_on_hand?: number | null
          committee_id: string
          committee_type?: string | null
          committee_type_full?: string | null
          contribution_refunds?: number | null
          contributions?: number | null
          description?: string | null
          designation?: string | null
          designation_full?: string | null
          disbursements?: number | null
          disbursements_by_committee?: Json | null
          fec_name?: string | null
          first_f1_date?: string | null
          independent_expenditures?: number | null
          name: string
          net_contributions?: number | null
          organization_type?: string | null
          organization_type_full?: string | null
          receipts?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          affiliated_committee_name?: string | null
          by_party?: Json | null
          cash_on_hand?: number | null
          committee_id?: string
          committee_type?: string | null
          committee_type_full?: string | null
          contribution_refunds?: number | null
          contributions?: number | null
          description?: string | null
          designation?: string | null
          designation_full?: string | null
          disbursements?: number | null
          disbursements_by_committee?: Json | null
          fec_name?: string | null
          first_f1_date?: string | null
          independent_expenditures?: number | null
          name?: string
          net_contributions?: number | null
          organization_type?: string | null
          organization_type_full?: string | null
          receipts?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      crypto_companies: {
        Row: {
          category: string[] | null
          description: string | null
          id: string
          name: string
          party_summary: Json | null
          total_contributions: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string[] | null
          description?: string | null
          id: string
          name: string
          party_summary?: Json | null
          total_contributions?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string[] | null
          description?: string | null
          id?: string
          name?: string
          party_summary?: Json | null
          total_contributions?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      crypto_individual_contributions: {
        Row: {
          amount: number
          candidate_fec_id: string | null
          candidate_name: string | null
          candidate_uuid: string | null
          committee_id: string
          committee_name: string | null
          company: string | null
          contribution_date: string | null
          contributor_employer: string | null
          contributor_first_name: string | null
          contributor_last_name: string | null
          contributor_name: string
          contributor_occupation: string | null
          created_at: string
          entity_type: string | null
          id: string
          individual_id: string | null
        }
        Insert: {
          amount?: number
          candidate_fec_id?: string | null
          candidate_name?: string | null
          candidate_uuid?: string | null
          committee_id: string
          committee_name?: string | null
          company?: string | null
          contribution_date?: string | null
          contributor_employer?: string | null
          contributor_first_name?: string | null
          contributor_last_name?: string | null
          contributor_name: string
          contributor_occupation?: string | null
          created_at?: string
          entity_type?: string | null
          id?: string
          individual_id?: string | null
        }
        Update: {
          amount?: number
          candidate_fec_id?: string | null
          candidate_name?: string | null
          candidate_uuid?: string | null
          committee_id?: string
          committee_name?: string | null
          company?: string | null
          contribution_date?: string | null
          contributor_employer?: string | null
          contributor_first_name?: string | null
          contributor_last_name?: string | null
          contributor_name?: string
          contributor_occupation?: string | null
          created_at?: string
          entity_type?: string | null
          id?: string
          individual_id?: string | null
        }
        Relationships: []
      }
      crypto_individuals: {
        Row: {
          companies: string[] | null
          employer: string | null
          id: string
          name: string
          occupation: string | null
          party_summary: Json | null
          top_recipients: Json | null
          total_contributions: number | null
          updated_at: string | null
        }
        Insert: {
          companies?: string[] | null
          employer?: string | null
          id: string
          name: string
          occupation?: string | null
          party_summary?: Json | null
          top_recipients?: Json | null
          total_contributions?: number | null
          updated_at?: string | null
        }
        Update: {
          companies?: string[] | null
          employer?: string | null
          id?: string
          name?: string
          occupation?: string | null
          party_summary?: Json | null
          top_recipients?: Json | null
          total_contributions?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      crypto_race_spending: {
        Row: {
          candidates: Json | null
          district: string | null
          id: string
          office: string
          race_key: string
          state: string
          total_spending: number | null
          updated_at: string | null
        }
        Insert: {
          candidates?: Json | null
          district?: string | null
          id?: string
          office: string
          race_key: string
          state: string
          total_spending?: number | null
          updated_at?: string | null
        }
        Update: {
          candidates?: Json | null
          district?: string | null
          id?: string
          office?: string
          race_key?: string
          state?: string
          total_spending?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      district_demographics: {
        Row: {
          ap_black: number | null
          ap_white: number | null
          area: number | null
          black_pop: number | null
          cd: string
          civ_health_covered: number | null
          civ_health_none: number | null
          civ_health_noninst_total: number | null
          civ_health_private: number | null
          civ_health_public: number | null
          civ_ind_agriculture: number | null
          civ_ind_arts_entertainment_food: number | null
          civ_ind_construction: number | null
          civ_ind_education_health_social: number | null
          civ_ind_finance_insurance_realestate: number | null
          civ_ind_information: number | null
          civ_ind_manufacturing: number | null
          civ_ind_other: number | null
          civ_ind_professional_scientific_mgmt: number | null
          civ_ind_public_admin: number | null
          civ_ind_retail: number | null
          civ_ind_total_employed: number | null
          civ_ind_transport_warehouse_utilities: number | null
          civ_ind_wholesale: number | null
          data_year: number
          deviation: number | null
          district_num: string
          f_black: number | null
          f_white: number | null
          f18_black: number | null
          f18_population: number | null
          f18_white: number | null
          id: string
          imported_at: string | null
          inc_mean_hhi: number | null
          inc_median_hhi: number | null
          inc_per_capita: number | null
          pop_emp_16plus_total: number | null
          pop_emp_armed_forces: number | null
          pop_emp_civilian_employed: number | null
          pop_emp_civilian_labor_force: number | null
          pop_emp_civilian_unemployed: number | null
          population: number | null
          race_id: string | null
          state_abbr: string
          updated_at: string | null
          white_pop: number | null
        }
        Insert: {
          ap_black?: number | null
          ap_white?: number | null
          area?: number | null
          black_pop?: number | null
          cd: string
          civ_health_covered?: number | null
          civ_health_none?: number | null
          civ_health_noninst_total?: number | null
          civ_health_private?: number | null
          civ_health_public?: number | null
          civ_ind_agriculture?: number | null
          civ_ind_arts_entertainment_food?: number | null
          civ_ind_construction?: number | null
          civ_ind_education_health_social?: number | null
          civ_ind_finance_insurance_realestate?: number | null
          civ_ind_information?: number | null
          civ_ind_manufacturing?: number | null
          civ_ind_other?: number | null
          civ_ind_professional_scientific_mgmt?: number | null
          civ_ind_public_admin?: number | null
          civ_ind_retail?: number | null
          civ_ind_total_employed?: number | null
          civ_ind_transport_warehouse_utilities?: number | null
          civ_ind_wholesale?: number | null
          data_year: number
          deviation?: number | null
          district_num: string
          f_black?: number | null
          f_white?: number | null
          f18_black?: number | null
          f18_population?: number | null
          f18_white?: number | null
          id?: string
          imported_at?: string | null
          inc_mean_hhi?: number | null
          inc_median_hhi?: number | null
          inc_per_capita?: number | null
          pop_emp_16plus_total?: number | null
          pop_emp_armed_forces?: number | null
          pop_emp_civilian_employed?: number | null
          pop_emp_civilian_labor_force?: number | null
          pop_emp_civilian_unemployed?: number | null
          population?: number | null
          race_id?: string | null
          state_abbr: string
          updated_at?: string | null
          white_pop?: number | null
        }
        Update: {
          ap_black?: number | null
          ap_white?: number | null
          area?: number | null
          black_pop?: number | null
          cd?: string
          civ_health_covered?: number | null
          civ_health_none?: number | null
          civ_health_noninst_total?: number | null
          civ_health_private?: number | null
          civ_health_public?: number | null
          civ_ind_agriculture?: number | null
          civ_ind_arts_entertainment_food?: number | null
          civ_ind_construction?: number | null
          civ_ind_education_health_social?: number | null
          civ_ind_finance_insurance_realestate?: number | null
          civ_ind_information?: number | null
          civ_ind_manufacturing?: number | null
          civ_ind_other?: number | null
          civ_ind_professional_scientific_mgmt?: number | null
          civ_ind_public_admin?: number | null
          civ_ind_retail?: number | null
          civ_ind_total_employed?: number | null
          civ_ind_transport_warehouse_utilities?: number | null
          civ_ind_wholesale?: number | null
          data_year?: number
          deviation?: number | null
          district_num?: string
          f_black?: number | null
          f_white?: number | null
          f18_black?: number | null
          f18_population?: number | null
          f18_white?: number | null
          id?: string
          imported_at?: string | null
          inc_mean_hhi?: number | null
          inc_median_hhi?: number | null
          inc_per_capita?: number | null
          pop_emp_16plus_total?: number | null
          pop_emp_armed_forces?: number | null
          pop_emp_civilian_employed?: number | null
          pop_emp_civilian_labor_force?: number | null
          pop_emp_civilian_unemployed?: number | null
          population?: number | null
          race_id?: string | null
          state_abbr?: string
          updated_at?: string | null
          white_pop?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "district_demographics_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["race_id"]
          },
        ]
      }
      earmarked_contributions: {
        Row: {
          candidate_id: string | null
          candidate_name: string | null
          committee_id: string
          contribution_receipt_amount: number | null
          contribution_receipt_date: string | null
          contributor_id: string | null
          contributor_name: string | null
          election_type: string | null
          entity_type: string | null
          entity_type_desc: string | null
          fec_election_year: number | null
          file_number: number | null
          id: string
          imported_at: string | null
          line_number: string | null
          load_date: string | null
          memo_code: string | null
          memo_text: string | null
          memoed_subtotal: boolean | null
          pdf_url: string | null
          receipt_type: string | null
          report_type: string | null
          report_year: number | null
          sub_id: string
          transaction_id: string | null
          two_year_transaction_period: number | null
        }
        Insert: {
          candidate_id?: string | null
          candidate_name?: string | null
          committee_id: string
          contribution_receipt_amount?: number | null
          contribution_receipt_date?: string | null
          contributor_id?: string | null
          contributor_name?: string | null
          election_type?: string | null
          entity_type?: string | null
          entity_type_desc?: string | null
          fec_election_year?: number | null
          file_number?: number | null
          id?: string
          imported_at?: string | null
          line_number?: string | null
          load_date?: string | null
          memo_code?: string | null
          memo_text?: string | null
          memoed_subtotal?: boolean | null
          pdf_url?: string | null
          receipt_type?: string | null
          report_type?: string | null
          report_year?: number | null
          sub_id: string
          transaction_id?: string | null
          two_year_transaction_period?: number | null
        }
        Update: {
          candidate_id?: string | null
          candidate_name?: string | null
          committee_id?: string
          contribution_receipt_amount?: number | null
          contribution_receipt_date?: string | null
          contributor_id?: string | null
          contributor_name?: string | null
          election_type?: string | null
          entity_type?: string | null
          entity_type_desc?: string | null
          fec_election_year?: number | null
          file_number?: number | null
          id?: string
          imported_at?: string | null
          line_number?: string | null
          load_date?: string | null
          memo_code?: string | null
          memo_text?: string | null
          memoed_subtotal?: boolean | null
          pdf_url?: string | null
          receipt_type?: string | null
          report_type?: string | null
          report_year?: number | null
          sub_id?: string
          transaction_id?: string | null
          two_year_transaction_period?: number | null
        }
        Relationships: []
      }
      economy_history: {
        Row: {
          created_at: string | null
          date: string
          id: string
          series_key: string
          value: number
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          series_key: string
          value: number
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          series_key?: string
          value?: number
        }
        Relationships: []
      }
      economy_indicators: {
        Row: {
          baseline_value: number | null
          category: string
          created_at: string | null
          current_value: number | null
          dollar_change: number | null
          id: string
          label: string
          metadata: Json | null
          pct_change: number | null
          period: string | null
          prior_value: number | null
          risk_score: number | null
          risk_tier: string | null
          series_id: string
          source: string | null
          subcategory: string | null
          trend: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          baseline_value?: number | null
          category: string
          created_at?: string | null
          current_value?: number | null
          dollar_change?: number | null
          id?: string
          label: string
          metadata?: Json | null
          pct_change?: number | null
          period?: string | null
          prior_value?: number | null
          risk_score?: number | null
          risk_tier?: string | null
          series_id: string
          source?: string | null
          subcategory?: string | null
          trend?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          baseline_value?: number | null
          category?: string
          created_at?: string | null
          current_value?: number | null
          dollar_change?: number | null
          id?: string
          label?: string
          metadata?: Json | null
          pct_change?: number | null
          period?: string | null
          prior_value?: number | null
          risk_score?: number | null
          risk_tier?: string | null
          series_id?: string
          source?: string | null
          subcategory?: string | null
          trend?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      feedback_posts: {
        Row: {
          created_at: string
          description: string | null
          id: string
          page_label: string | null
          page_url: string
          site: string
          status: string
          title: string
          voter_fingerprint: string | null
          votes: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          page_label?: string | null
          page_url: string
          site?: string
          status?: string
          title: string
          voter_fingerprint?: string | null
          votes?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          page_label?: string | null
          page_url?: string
          site?: string
          status?: string
          title?: string
          voter_fingerprint?: string | null
          votes?: number
        }
        Relationships: []
      }
      feedback_votes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          voter_fingerprint: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          voter_fingerprint: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          voter_fingerprint?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_votes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feedback_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      gas_prices: {
        Row: {
          created_at: string
          diesel: number | null
          fetched_date: string
          id: string
          mid_grade: number | null
          premium: number | null
          regular: number | null
          state: string
          state_abbr: string
        }
        Insert: {
          created_at?: string
          diesel?: number | null
          fetched_date?: string
          id?: string
          mid_grade?: number | null
          premium?: number | null
          regular?: number | null
          state: string
          state_abbr: string
        }
        Update: {
          created_at?: string
          diesel?: number | null
          fetched_date?: string
          id?: string
          mid_grade?: number | null
          premium?: number | null
          regular?: number | null
          state?: string
          state_abbr?: string
        }
        Relationships: []
      }
      gp_fec_snapshot: {
        Row: {
          fec_id: string
          scraped_at: string | null
          state: string
        }
        Insert: {
          fec_id: string
          scraped_at?: string | null
          state: string
        }
        Update: {
          fec_id?: string
          scraped_at?: string | null
          state?: string
        }
        Relationships: []
      }
      grade_config: {
        Row: {
          description: string | null
          key: string
          value: number
        }
        Insert: {
          description?: string | null
          key: string
          value: number
        }
        Update: {
          description?: string | null
          key?: string
          value?: number
        }
        Relationships: []
      }
      house_candidates_fec_matched: {
        Row: {
          fec_district: number | null
          fec_id: string | null
          fec_name: string
          fec_state: string
          house_filer_district: number
          house_filer_name: string
          house_filer_state: string
          match_score: number
          matched: boolean
        }
        Insert: {
          fec_district?: number | null
          fec_id?: string | null
          fec_name: string
          fec_state: string
          house_filer_district: number
          house_filer_name: string
          house_filer_state: string
          match_score: number
          matched: boolean
        }
        Update: {
          fec_district?: number | null
          fec_id?: string | null
          fec_name?: string
          fec_state?: string
          house_filer_district?: number
          house_filer_name?: string
          house_filer_state?: string
          match_score?: number
          matched?: boolean
        }
        Relationships: []
      }
      independent_expenditures: {
        Row: {
          candidate_id: string | null
          candidate_name: string | null
          candidate_office: string | null
          candidate_office_district: string | null
          candidate_office_state: string | null
          committee_id: string | null
          committee_name: string | null
          election_type: string | null
          expenditure_amount: number | null
          expenditure_date: string | null
          expenditure_description: string | null
          file_number: number | null
          filing_date: string | null
          id: string
          imported_at: string | null
          payee_name: string | null
          race_id: string | null
          support_oppose_indicator: string | null
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          candidate_id?: string | null
          candidate_name?: string | null
          candidate_office?: string | null
          candidate_office_district?: string | null
          candidate_office_state?: string | null
          committee_id?: string | null
          committee_name?: string | null
          election_type?: string | null
          expenditure_amount?: number | null
          expenditure_date?: string | null
          expenditure_description?: string | null
          file_number?: number | null
          filing_date?: string | null
          id?: string
          imported_at?: string | null
          payee_name?: string | null
          race_id?: string | null
          support_oppose_indicator?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          candidate_id?: string | null
          candidate_name?: string | null
          candidate_office?: string | null
          candidate_office_district?: string | null
          candidate_office_state?: string | null
          committee_id?: string | null
          committee_name?: string | null
          election_type?: string | null
          expenditure_amount?: number | null
          expenditure_date?: string | null
          expenditure_description?: string | null
          file_number?: number | null
          filing_date?: string | null
          id?: string
          imported_at?: string | null
          payee_name?: string | null
          race_id?: string | null
          support_oppose_indicator?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "independent_expenditures_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["race_id"]
          },
        ]
      }
      investment_cache: {
        Row: {
          created_at: string | null
          emoji: string | null
          id: string
          inaug_pct_change: number | null
          is_crypto: boolean | null
          label: string | null
          latest_price: number | null
          pct_change_3y: number | null
          prices: Json | null
          ticker: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          emoji?: string | null
          id?: string
          inaug_pct_change?: number | null
          is_crypto?: boolean | null
          label?: string | null
          latest_price?: number | null
          pct_change_3y?: number | null
          prices?: Json | null
          ticker: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          emoji?: string | null
          id?: string
          inaug_pct_change?: number | null
          is_crypto?: boolean | null
          label?: string | null
          latest_price?: number | null
          pct_change_3y?: number | null
          prices?: Json | null
          ticker?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      maga_inc: {
        Row: {
          amendment_indicator: string | null
          back_reference_sched_name: string | null
          back_reference_tran_id_number: string | null
          candidate_id: string | null
          candidate_id_fec: string | null
          candidate_name: string | null
          candidate_office: string | null
          candidate_office_district: string | null
          candidate_office_state: string | null
          committee_id: string | null
          committee_name: string | null
          conduit_committee_city: string | null
          conduit_committee_id: string | null
          conduit_committee_name: string | null
          conduit_committee_state: string | null
          conduit_committee_street1: string | null
          conduit_committee_street2: string | null
          conduit_committee_zip: string | null
          contribution_receipt_amount: number | null
          contribution_receipt_date: string | null
          contributor_aggregate_ytd: number | null
          contributor_city: string | null
          contributor_employer: string | null
          contributor_first_name: string | null
          contributor_id: string | null
          contributor_last_name: string | null
          contributor_middle_name: string | null
          contributor_name: string | null
          contributor_occupation: string | null
          contributor_prefix: string | null
          contributor_state: string | null
          contributor_street_1: string | null
          contributor_street_2: string | null
          contributor_suffix: string | null
          contributor_zip: string | null
          created_at: string | null
          donor_committee_name: string | null
          election_type: string | null
          election_type_full: string | null
          entity_type: string | null
          entity_type_desc: string | null
          fec_election_type_desc: string | null
          fec_election_year: number | null
          file_number: number | null
          id: string
          image_number: string | null
          increased_limit: string | null
          is_individual: boolean | null
          line_number: string | null
          line_number_label: string | null
          load_date: string | null
          memo_code: string | null
          memo_text: string | null
          memoed_subtotal: boolean | null
          national_committee_nonfederal_account: string | null
          original_sub_id: string | null
          pdf_url: string | null
          receipt_type: string | null
          receipt_type_full: string | null
          report_type: string | null
          report_year: number | null
          schedule_type: string | null
          schedule_type_full: string | null
          sub_id: string | null
          transaction_id: string | null
          two_year_transaction_period: number | null
        }
        Insert: {
          amendment_indicator?: string | null
          back_reference_sched_name?: string | null
          back_reference_tran_id_number?: string | null
          candidate_id?: string | null
          candidate_id_fec?: string | null
          candidate_name?: string | null
          candidate_office?: string | null
          candidate_office_district?: string | null
          candidate_office_state?: string | null
          committee_id?: string | null
          committee_name?: string | null
          conduit_committee_city?: string | null
          conduit_committee_id?: string | null
          conduit_committee_name?: string | null
          conduit_committee_state?: string | null
          conduit_committee_street1?: string | null
          conduit_committee_street2?: string | null
          conduit_committee_zip?: string | null
          contribution_receipt_amount?: number | null
          contribution_receipt_date?: string | null
          contributor_aggregate_ytd?: number | null
          contributor_city?: string | null
          contributor_employer?: string | null
          contributor_first_name?: string | null
          contributor_id?: string | null
          contributor_last_name?: string | null
          contributor_middle_name?: string | null
          contributor_name?: string | null
          contributor_occupation?: string | null
          contributor_prefix?: string | null
          contributor_state?: string | null
          contributor_street_1?: string | null
          contributor_street_2?: string | null
          contributor_suffix?: string | null
          contributor_zip?: string | null
          created_at?: string | null
          donor_committee_name?: string | null
          election_type?: string | null
          election_type_full?: string | null
          entity_type?: string | null
          entity_type_desc?: string | null
          fec_election_type_desc?: string | null
          fec_election_year?: number | null
          file_number?: number | null
          id: string
          image_number?: string | null
          increased_limit?: string | null
          is_individual?: boolean | null
          line_number?: string | null
          line_number_label?: string | null
          load_date?: string | null
          memo_code?: string | null
          memo_text?: string | null
          memoed_subtotal?: boolean | null
          national_committee_nonfederal_account?: string | null
          original_sub_id?: string | null
          pdf_url?: string | null
          receipt_type?: string | null
          receipt_type_full?: string | null
          report_type?: string | null
          report_year?: number | null
          schedule_type?: string | null
          schedule_type_full?: string | null
          sub_id?: string | null
          transaction_id?: string | null
          two_year_transaction_period?: number | null
        }
        Update: {
          amendment_indicator?: string | null
          back_reference_sched_name?: string | null
          back_reference_tran_id_number?: string | null
          candidate_id?: string | null
          candidate_id_fec?: string | null
          candidate_name?: string | null
          candidate_office?: string | null
          candidate_office_district?: string | null
          candidate_office_state?: string | null
          committee_id?: string | null
          committee_name?: string | null
          conduit_committee_city?: string | null
          conduit_committee_id?: string | null
          conduit_committee_name?: string | null
          conduit_committee_state?: string | null
          conduit_committee_street1?: string | null
          conduit_committee_street2?: string | null
          conduit_committee_zip?: string | null
          contribution_receipt_amount?: number | null
          contribution_receipt_date?: string | null
          contributor_aggregate_ytd?: number | null
          contributor_city?: string | null
          contributor_employer?: string | null
          contributor_first_name?: string | null
          contributor_id?: string | null
          contributor_last_name?: string | null
          contributor_middle_name?: string | null
          contributor_name?: string | null
          contributor_occupation?: string | null
          contributor_prefix?: string | null
          contributor_state?: string | null
          contributor_street_1?: string | null
          contributor_street_2?: string | null
          contributor_suffix?: string | null
          contributor_zip?: string | null
          created_at?: string | null
          donor_committee_name?: string | null
          election_type?: string | null
          election_type_full?: string | null
          entity_type?: string | null
          entity_type_desc?: string | null
          fec_election_type_desc?: string | null
          fec_election_year?: number | null
          file_number?: number | null
          id?: string
          image_number?: string | null
          increased_limit?: string | null
          is_individual?: boolean | null
          line_number?: string | null
          line_number_label?: string | null
          load_date?: string | null
          memo_code?: string | null
          memo_text?: string | null
          memoed_subtotal?: boolean | null
          national_committee_nonfederal_account?: string | null
          original_sub_id?: string | null
          pdf_url?: string | null
          receipt_type?: string | null
          receipt_type_full?: string | null
          report_type?: string | null
          report_year?: number | null
          schedule_type?: string | null
          schedule_type_full?: string | null
          sub_id?: string | null
          transaction_id?: string | null
          two_year_transaction_period?: number | null
        }
        Relationships: []
      }
      new_house_candidates_temp: {
        Row: {
          candidate_uuid: string | null
        }
        Insert: {
          candidate_uuid?: string | null
        }
        Update: {
          candidate_uuid?: string | null
        }
        Relationships: []
      }
      new_senate_candidates_temp: {
        Row: {
          candidate_uuid: string | null
        }
        Insert: {
          candidate_uuid?: string | null
        }
        Update: {
          candidate_uuid?: string | null
        }
        Relationships: []
      }
      oge_assets_income: {
        Row: {
          asset_description: string | null
          asset_type: string | null
          created_at: string | null
          date_acquired: string | null
          filer_id: string | null
          filing_year: number | null
          income_avg: number | null
          income_code: string | null
          income_max: number | null
          income_min: number | null
          income_range: string | null
          income_type: string | null
          location: string | null
          owner: string | null
          ownership_pct: string | null
          part_number: number | null
          report_type: string | null
          source_row_num: number | null
          underlying_assets: string | null
          updated_at: string | null
          uuid: string
          value_avg: number | null
          value_code: string | null
          value_max: number | null
          value_min: number | null
          value_range: string | null
        }
        Insert: {
          asset_description?: string | null
          asset_type?: string | null
          created_at?: string | null
          date_acquired?: string | null
          filer_id?: string | null
          filing_year?: number | null
          income_avg?: number | null
          income_code?: string | null
          income_max?: number | null
          income_min?: number | null
          income_range?: string | null
          income_type?: string | null
          location?: string | null
          owner?: string | null
          ownership_pct?: string | null
          part_number?: number | null
          report_type?: string | null
          source_row_num?: number | null
          underlying_assets?: string | null
          updated_at?: string | null
          uuid?: string
          value_avg?: number | null
          value_code?: string | null
          value_max?: number | null
          value_min?: number | null
          value_range?: string | null
        }
        Update: {
          asset_description?: string | null
          asset_type?: string | null
          created_at?: string | null
          date_acquired?: string | null
          filer_id?: string | null
          filing_year?: number | null
          income_avg?: number | null
          income_code?: string | null
          income_max?: number | null
          income_min?: number | null
          income_range?: string | null
          income_type?: string | null
          location?: string | null
          owner?: string | null
          ownership_pct?: string | null
          part_number?: number | null
          report_type?: string | null
          source_row_num?: number | null
          underlying_assets?: string | null
          updated_at?: string | null
          uuid?: string
          value_avg?: number | null
          value_code?: string | null
          value_max?: number | null
          value_min?: number | null
          value_range?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_oge_assets_income_filer"
            columns: ["filer_id"]
            isOneToOne: false
            referencedRelation: "cabinet_member_summary"
            referencedColumns: ["cabinet_id"]
          },
          {
            foreignKeyName: "fk_oge_assets_income_filer"
            columns: ["filer_id"]
            isOneToOne: false
            referencedRelation: "cabinet_members"
            referencedColumns: ["cabinet_id"]
          },
        ]
      }
      oge_compensation_sources: {
        Row: {
          amount: number | null
          brief_description: string | null
          city: string | null
          created_at: string | null
          filer_id: string | null
          filing_year: number | null
          report_type: string | null
          source_name: string | null
          state: string | null
          updated_at: string | null
          uuid: string
        }
        Insert: {
          amount?: number | null
          brief_description?: string | null
          city?: string | null
          created_at?: string | null
          filer_id?: string | null
          filing_year?: number | null
          report_type?: string | null
          source_name?: string | null
          state?: string | null
          updated_at?: string | null
          uuid?: string
        }
        Update: {
          amount?: number | null
          brief_description?: string | null
          city?: string | null
          created_at?: string | null
          filer_id?: string | null
          filing_year?: number | null
          report_type?: string | null
          source_name?: string | null
          state?: string | null
          updated_at?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_oge_compensation_sources_filer"
            columns: ["filer_id"]
            isOneToOne: false
            referencedRelation: "cabinet_member_summary"
            referencedColumns: ["cabinet_id"]
          },
          {
            foreignKeyName: "fk_oge_compensation_sources_filer"
            columns: ["filer_id"]
            isOneToOne: false
            referencedRelation: "cabinet_members"
            referencedColumns: ["cabinet_id"]
          },
        ]
      }
      oge_employment_agreements: {
        Row: {
          agreement_type: string | null
          city: string | null
          created_at: string | null
          date_entered: string | null
          employer_party: string | null
          filer_id: string | null
          filing_year: number | null
          report_type: string | null
          state: string | null
          status_and_terms: string | null
          updated_at: string | null
          uuid: string
        }
        Insert: {
          agreement_type?: string | null
          city?: string | null
          created_at?: string | null
          date_entered?: string | null
          employer_party?: string | null
          filer_id?: string | null
          filing_year?: number | null
          report_type?: string | null
          state?: string | null
          status_and_terms?: string | null
          updated_at?: string | null
          uuid?: string
        }
        Update: {
          agreement_type?: string | null
          city?: string | null
          created_at?: string | null
          date_entered?: string | null
          employer_party?: string | null
          filer_id?: string | null
          filing_year?: number | null
          report_type?: string | null
          state?: string | null
          status_and_terms?: string | null
          updated_at?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_oge_employment_agreements_filer"
            columns: ["filer_id"]
            isOneToOne: false
            referencedRelation: "cabinet_member_summary"
            referencedColumns: ["cabinet_id"]
          },
          {
            foreignKeyName: "fk_oge_employment_agreements_filer"
            columns: ["filer_id"]
            isOneToOne: false
            referencedRelation: "cabinet_members"
            referencedColumns: ["cabinet_id"]
          },
          {
            foreignKeyName: "oge_employment_agreements_filer_id_fkey"
            columns: ["filer_id"]
            isOneToOne: false
            referencedRelation: "cabinet_member_summary"
            referencedColumns: ["cabinet_id"]
          },
          {
            foreignKeyName: "oge_employment_agreements_filer_id_fkey"
            columns: ["filer_id"]
            isOneToOne: false
            referencedRelation: "cabinet_members"
            referencedColumns: ["cabinet_id"]
          },
        ]
      }
      oge_gifts_travel: {
        Row: {
          created_at: string | null
          description: string | null
          filer_id: string | null
          filing_year: number | null
          report_type: string | null
          source_name: string | null
          travel_dates: string | null
          travel_destination: string | null
          travel_itinerary: string | null
          type: string | null
          updated_at: string | null
          uuid: string
          value: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          filer_id?: string | null
          filing_year?: number | null
          report_type?: string | null
          source_name?: string | null
          travel_dates?: string | null
          travel_destination?: string | null
          travel_itinerary?: string | null
          type?: string | null
          updated_at?: string | null
          uuid?: string
          value?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          filer_id?: string | null
          filing_year?: number | null
          report_type?: string | null
          source_name?: string | null
          travel_dates?: string | null
          travel_destination?: string | null
          travel_itinerary?: string | null
          type?: string | null
          updated_at?: string | null
          uuid?: string
          value?: number | null
        }
        Relationships: []
      }
      oge_liabilities: {
        Row: {
          amount_avg: number | null
          amount_code: string | null
          amount_max: number | null
          amount_min: number | null
          amount_range: string | null
          asset_type: string | null
          created_at: string | null
          creditor_name: string | null
          date_incurred: string | null
          description: string | null
          filer_id: string | null
          filing_year: number | null
          interest_rate: string | null
          liability_type: string | null
          owner: string | null
          report_type: string | null
          status: string | null
          updated_at: string | null
          uuid: string
        }
        Insert: {
          amount_avg?: number | null
          amount_code?: string | null
          amount_max?: number | null
          amount_min?: number | null
          amount_range?: string | null
          asset_type?: string | null
          created_at?: string | null
          creditor_name?: string | null
          date_incurred?: string | null
          description?: string | null
          filer_id?: string | null
          filing_year?: number | null
          interest_rate?: string | null
          liability_type?: string | null
          owner?: string | null
          report_type?: string | null
          status?: string | null
          updated_at?: string | null
          uuid?: string
        }
        Update: {
          amount_avg?: number | null
          amount_code?: string | null
          amount_max?: number | null
          amount_min?: number | null
          amount_range?: string | null
          asset_type?: string | null
          created_at?: string | null
          creditor_name?: string | null
          date_incurred?: string | null
          description?: string | null
          filer_id?: string | null
          filing_year?: number | null
          interest_rate?: string | null
          liability_type?: string | null
          owner?: string | null
          report_type?: string | null
          status?: string | null
          updated_at?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_oge_liabilities_filer"
            columns: ["filer_id"]
            isOneToOne: false
            referencedRelation: "cabinet_member_summary"
            referencedColumns: ["cabinet_id"]
          },
          {
            foreignKeyName: "fk_oge_liabilities_filer"
            columns: ["filer_id"]
            isOneToOne: false
            referencedRelation: "cabinet_members"
            referencedColumns: ["cabinet_id"]
          },
        ]
      }
      oge_positions: {
        Row: {
          asset_type: string | null
          city: string | null
          created_at: string | null
          filer_id: string | null
          filing_year: number | null
          from_date: string | null
          organization_name: string | null
          position_title: string | null
          report_type: string | null
          state: string | null
          to_date: string | null
          updated_at: string | null
          uuid: string
        }
        Insert: {
          asset_type?: string | null
          city?: string | null
          created_at?: string | null
          filer_id?: string | null
          filing_year?: number | null
          from_date?: string | null
          organization_name?: string | null
          position_title?: string | null
          report_type?: string | null
          state?: string | null
          to_date?: string | null
          updated_at?: string | null
          uuid?: string
        }
        Update: {
          asset_type?: string | null
          city?: string | null
          created_at?: string | null
          filer_id?: string | null
          filing_year?: number | null
          from_date?: string | null
          organization_name?: string | null
          position_title?: string | null
          report_type?: string | null
          state?: string | null
          to_date?: string | null
          updated_at?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_oge_positions_filer"
            columns: ["filer_id"]
            isOneToOne: false
            referencedRelation: "cabinet_member_summary"
            referencedColumns: ["cabinet_id"]
          },
          {
            foreignKeyName: "fk_oge_positions_filer"
            columns: ["filer_id"]
            isOneToOne: false
            referencedRelation: "cabinet_members"
            referencedColumns: ["cabinet_id"]
          },
        ]
      }
      oge_transactions: {
        Row: {
          asset_type: string | null
          created_at: string | null
          description: string | null
          filer_id: string | null
          filing_year: number | null
          owner: string | null
          report_type: string | null
          transaction_date: string | null
          transaction_type: string | null
          updated_at: string | null
          uuid: string
          value_avg: number | null
          value_code: string | null
          value_max: number | null
          value_min: number | null
          value_range: string | null
        }
        Insert: {
          asset_type?: string | null
          created_at?: string | null
          description?: string | null
          filer_id?: string | null
          filing_year?: number | null
          owner?: string | null
          report_type?: string | null
          transaction_date?: string | null
          transaction_type?: string | null
          updated_at?: string | null
          uuid?: string
          value_avg?: number | null
          value_code?: string | null
          value_max?: number | null
          value_min?: number | null
          value_range?: string | null
        }
        Update: {
          asset_type?: string | null
          created_at?: string | null
          description?: string | null
          filer_id?: string | null
          filing_year?: number | null
          owner?: string | null
          report_type?: string | null
          transaction_date?: string | null
          transaction_type?: string | null
          updated_at?: string | null
          uuid?: string
          value_avg?: number | null
          value_code?: string | null
          value_max?: number | null
          value_min?: number | null
          value_range?: string | null
        }
        Relationships: []
      }
      pac_contributions: {
        Row: {
          bioguideid: string | null
          candidate_id: string
          committee_id: string | null
          committee_uuid: string | null
          contribution_receipt_total: number | null
          contributor_id: string | null
          contributor_name: string | null
          district: string | null
          id: string
          name: string | null
          organization_type: string | null
          partyname: string | null
          state: string | null
          two_year_transaction_period: number | null
        }
        Insert: {
          bioguideid?: string | null
          candidate_id: string
          committee_id?: string | null
          committee_uuid?: string | null
          contribution_receipt_total?: number | null
          contributor_id?: string | null
          contributor_name?: string | null
          district?: string | null
          id?: string
          name?: string | null
          organization_type?: string | null
          partyname?: string | null
          state?: string | null
          two_year_transaction_period?: number | null
        }
        Update: {
          bioguideid?: string | null
          candidate_id?: string
          committee_id?: string | null
          committee_uuid?: string | null
          contribution_receipt_total?: number | null
          contributor_id?: string | null
          contributor_name?: string | null
          district?: string | null
          id?: string
          name?: string | null
          organization_type?: string | null
          partyname?: string | null
          state?: string | null
          two_year_transaction_period?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pac_contributions_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_assets"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "pac_contributions_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_committee_fundraising"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "pac_contributions_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pac_contributions_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "crypto_exec_candidate_totals"
            referencedColumns: ["candidate_uuid"]
          },
          {
            foreignKeyName: "pac_contributions_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "earmarked_by_candidate"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "pac_contributions_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "extension_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pac_contributions_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "grade_inputs"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "pac_contributions_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pac_cycle_recipients"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "pac_contributions_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pro_israel_pac_candidate_totals"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "pac_contributions_committee_uuid_fkey"
            columns: ["committee_uuid"]
            isOneToOne: false
            referencedRelation: "pac_master"
            referencedColumns: ["id"]
          },
        ]
      }
      pac_contributions_master: {
        Row: {
          amendment_indicator: string | null
          back_reference_sched_name: string | null
          back_reference_tran_id_number: string | null
          candidate_id: string | null
          candidate_id_fec: string | null
          candidate_name: string | null
          candidate_office: string | null
          candidate_office_district: string | null
          candidate_office_state: string | null
          committee_id: string | null
          committee_name: string | null
          conduit_committee_city: string | null
          conduit_committee_id: string | null
          conduit_committee_name: string | null
          conduit_committee_state: string | null
          conduit_committee_street1: string | null
          conduit_committee_street2: string | null
          conduit_committee_zip: string | null
          contribution_receipt_amount: number
          contribution_receipt_date: string | null
          contributor_aggregate_ytd: number | null
          contributor_city: string | null
          contributor_employer: string | null
          contributor_first_name: string | null
          contributor_id: string | null
          contributor_last_name: string | null
          contributor_middle_name: string | null
          contributor_name: string | null
          contributor_occupation: string | null
          contributor_prefix: string | null
          contributor_state: string | null
          contributor_street_1: string | null
          contributor_street_2: string | null
          contributor_suffix: string | null
          contributor_zip: string | null
          created_at: string | null
          donor_committee_name: string | null
          election_type: string | null
          election_type_full: string | null
          entity_type: string | null
          entity_type_desc: string | null
          fec_election_type_desc: string | null
          fec_election_year: number | null
          file_number: number | null
          id: string
          image_number: string | null
          increased_limit: string | null
          is_individual: boolean | null
          line_number: string | null
          line_number_label: string | null
          load_date: string | null
          memo_code: string | null
          memo_text: string | null
          memoed_subtotal: boolean | null
          national_committee_nonfederal_account: string | null
          original_sub_id: string | null
          pdf_url: string | null
          receipt_type: string | null
          receipt_type_full: string | null
          report_type: string | null
          report_year: number | null
          schedule_type: string | null
          schedule_type_full: string | null
          sub_id: string
          transaction_id: string | null
          two_year_transaction_period: number | null
        }
        Insert: {
          amendment_indicator?: string | null
          back_reference_sched_name?: string | null
          back_reference_tran_id_number?: string | null
          candidate_id?: string | null
          candidate_id_fec?: string | null
          candidate_name?: string | null
          candidate_office?: string | null
          candidate_office_district?: string | null
          candidate_office_state?: string | null
          committee_id?: string | null
          committee_name?: string | null
          conduit_committee_city?: string | null
          conduit_committee_id?: string | null
          conduit_committee_name?: string | null
          conduit_committee_state?: string | null
          conduit_committee_street1?: string | null
          conduit_committee_street2?: string | null
          conduit_committee_zip?: string | null
          contribution_receipt_amount: number
          contribution_receipt_date?: string | null
          contributor_aggregate_ytd?: number | null
          contributor_city?: string | null
          contributor_employer?: string | null
          contributor_first_name?: string | null
          contributor_id?: string | null
          contributor_last_name?: string | null
          contributor_middle_name?: string | null
          contributor_name?: string | null
          contributor_occupation?: string | null
          contributor_prefix?: string | null
          contributor_state?: string | null
          contributor_street_1?: string | null
          contributor_street_2?: string | null
          contributor_suffix?: string | null
          contributor_zip?: string | null
          created_at?: string | null
          donor_committee_name?: string | null
          election_type?: string | null
          election_type_full?: string | null
          entity_type?: string | null
          entity_type_desc?: string | null
          fec_election_type_desc?: string | null
          fec_election_year?: number | null
          file_number?: number | null
          id?: string
          image_number?: string | null
          increased_limit?: string | null
          is_individual?: boolean | null
          line_number?: string | null
          line_number_label?: string | null
          load_date?: string | null
          memo_code?: string | null
          memo_text?: string | null
          memoed_subtotal?: boolean | null
          national_committee_nonfederal_account?: string | null
          original_sub_id?: string | null
          pdf_url?: string | null
          receipt_type?: string | null
          receipt_type_full?: string | null
          report_type?: string | null
          report_year?: number | null
          schedule_type?: string | null
          schedule_type_full?: string | null
          sub_id: string
          transaction_id?: string | null
          two_year_transaction_period?: number | null
        }
        Update: {
          amendment_indicator?: string | null
          back_reference_sched_name?: string | null
          back_reference_tran_id_number?: string | null
          candidate_id?: string | null
          candidate_id_fec?: string | null
          candidate_name?: string | null
          candidate_office?: string | null
          candidate_office_district?: string | null
          candidate_office_state?: string | null
          committee_id?: string | null
          committee_name?: string | null
          conduit_committee_city?: string | null
          conduit_committee_id?: string | null
          conduit_committee_name?: string | null
          conduit_committee_state?: string | null
          conduit_committee_street1?: string | null
          conduit_committee_street2?: string | null
          conduit_committee_zip?: string | null
          contribution_receipt_amount?: number
          contribution_receipt_date?: string | null
          contributor_aggregate_ytd?: number | null
          contributor_city?: string | null
          contributor_employer?: string | null
          contributor_first_name?: string | null
          contributor_id?: string | null
          contributor_last_name?: string | null
          contributor_middle_name?: string | null
          contributor_name?: string | null
          contributor_occupation?: string | null
          contributor_prefix?: string | null
          contributor_state?: string | null
          contributor_street_1?: string | null
          contributor_street_2?: string | null
          contributor_suffix?: string | null
          contributor_zip?: string | null
          created_at?: string | null
          donor_committee_name?: string | null
          election_type?: string | null
          election_type_full?: string | null
          entity_type?: string | null
          entity_type_desc?: string | null
          fec_election_type_desc?: string | null
          fec_election_year?: number | null
          file_number?: number | null
          id?: string
          image_number?: string | null
          increased_limit?: string | null
          is_individual?: boolean | null
          line_number?: string | null
          line_number_label?: string | null
          load_date?: string | null
          memo_code?: string | null
          memo_text?: string | null
          memoed_subtotal?: boolean | null
          national_committee_nonfederal_account?: string | null
          original_sub_id?: string | null
          pdf_url?: string | null
          receipt_type?: string | null
          receipt_type_full?: string | null
          report_type?: string | null
          report_year?: number | null
          schedule_type?: string | null
          schedule_type_full?: string | null
          sub_id?: string
          transaction_id?: string | null
          two_year_transaction_period?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pac_contributions_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_assets"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_pac_contributions_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_committee_fundraising"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_pac_contributions_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pac_contributions_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "crypto_exec_candidate_totals"
            referencedColumns: ["candidate_uuid"]
          },
          {
            foreignKeyName: "fk_pac_contributions_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "earmarked_by_candidate"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_pac_contributions_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "extension_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pac_contributions_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "grade_inputs"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_pac_contributions_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pac_cycle_recipients"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_pac_contributions_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pro_israel_pac_candidate_totals"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_pac_contributions_committee"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "pac_contributions_by_year"
            referencedColumns: ["pac_id"]
          },
          {
            foreignKeyName: "fk_pac_contributions_committee"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "pac_master"
            referencedColumns: ["cmte_id"]
          },
          {
            foreignKeyName: "fk_pac_contributions_contributor"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "pac_contributions_by_year"
            referencedColumns: ["pac_id"]
          },
          {
            foreignKeyName: "fk_pac_contributions_contributor"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "pac_master"
            referencedColumns: ["cmte_id"]
          },
        ]
      }
      pac_contributions_master_old: {
        Row: {
          amendment_indicator: string | null
          back_reference_sched_name: string | null
          back_reference_tran_id_number: string | null
          candidate_id: string | null
          candidate_id_fec: string | null
          candidate_name: string | null
          candidate_office: string | null
          candidate_office_district: string | null
          candidate_office_state: string | null
          committee_id: string
          committee_name: string | null
          conduit_committee_city: string | null
          conduit_committee_id: string | null
          conduit_committee_name: string | null
          conduit_committee_state: string | null
          conduit_committee_street1: string | null
          conduit_committee_street2: string | null
          conduit_committee_zip: string | null
          contribution_receipt_amount: number
          contribution_receipt_date: string | null
          contributor_aggregate_ytd: number | null
          contributor_city: string | null
          contributor_employer: string | null
          contributor_first_name: string | null
          contributor_id: string | null
          contributor_last_name: string | null
          contributor_middle_name: string | null
          contributor_name: string | null
          contributor_occupation: string | null
          contributor_prefix: string | null
          contributor_state: string | null
          contributor_street_1: string | null
          contributor_street_2: string | null
          contributor_suffix: string | null
          contributor_zip: string | null
          created_at: string | null
          donor_committee_name: string | null
          election_type: string | null
          election_type_full: string | null
          entity_type: string | null
          entity_type_desc: string | null
          fec_election_type_desc: string | null
          fec_election_year: number | null
          file_number: number | null
          id: string
          image_number: string | null
          increased_limit: string | null
          is_individual: boolean | null
          line_number: string | null
          line_number_label: string | null
          load_date: string | null
          memo_code: string | null
          memo_text: string | null
          memoed_subtotal: boolean | null
          national_committee_nonfederal_account: string | null
          original_sub_id: string | null
          pdf_url: string | null
          receipt_type: string | null
          receipt_type_full: string | null
          report_type: string | null
          report_year: number | null
          schedule_type: string | null
          schedule_type_full: string | null
          sub_id: string
          transaction_id: string | null
          two_year_transaction_period: number | null
        }
        Insert: {
          amendment_indicator?: string | null
          back_reference_sched_name?: string | null
          back_reference_tran_id_number?: string | null
          candidate_id?: string | null
          candidate_id_fec?: string | null
          candidate_name?: string | null
          candidate_office?: string | null
          candidate_office_district?: string | null
          candidate_office_state?: string | null
          committee_id: string
          committee_name?: string | null
          conduit_committee_city?: string | null
          conduit_committee_id?: string | null
          conduit_committee_name?: string | null
          conduit_committee_state?: string | null
          conduit_committee_street1?: string | null
          conduit_committee_street2?: string | null
          conduit_committee_zip?: string | null
          contribution_receipt_amount: number
          contribution_receipt_date?: string | null
          contributor_aggregate_ytd?: number | null
          contributor_city?: string | null
          contributor_employer?: string | null
          contributor_first_name?: string | null
          contributor_id?: string | null
          contributor_last_name?: string | null
          contributor_middle_name?: string | null
          contributor_name?: string | null
          contributor_occupation?: string | null
          contributor_prefix?: string | null
          contributor_state?: string | null
          contributor_street_1?: string | null
          contributor_street_2?: string | null
          contributor_suffix?: string | null
          contributor_zip?: string | null
          created_at?: string | null
          donor_committee_name?: string | null
          election_type?: string | null
          election_type_full?: string | null
          entity_type?: string | null
          entity_type_desc?: string | null
          fec_election_type_desc?: string | null
          fec_election_year?: number | null
          file_number?: number | null
          id?: string
          image_number?: string | null
          increased_limit?: string | null
          is_individual?: boolean | null
          line_number?: string | null
          line_number_label?: string | null
          load_date?: string | null
          memo_code?: string | null
          memo_text?: string | null
          memoed_subtotal?: boolean | null
          national_committee_nonfederal_account?: string | null
          original_sub_id?: string | null
          pdf_url?: string | null
          receipt_type?: string | null
          receipt_type_full?: string | null
          report_type?: string | null
          report_year?: number | null
          schedule_type?: string | null
          schedule_type_full?: string | null
          sub_id: string
          transaction_id?: string | null
          two_year_transaction_period?: number | null
        }
        Update: {
          amendment_indicator?: string | null
          back_reference_sched_name?: string | null
          back_reference_tran_id_number?: string | null
          candidate_id?: string | null
          candidate_id_fec?: string | null
          candidate_name?: string | null
          candidate_office?: string | null
          candidate_office_district?: string | null
          candidate_office_state?: string | null
          committee_id?: string
          committee_name?: string | null
          conduit_committee_city?: string | null
          conduit_committee_id?: string | null
          conduit_committee_name?: string | null
          conduit_committee_state?: string | null
          conduit_committee_street1?: string | null
          conduit_committee_street2?: string | null
          conduit_committee_zip?: string | null
          contribution_receipt_amount?: number
          contribution_receipt_date?: string | null
          contributor_aggregate_ytd?: number | null
          contributor_city?: string | null
          contributor_employer?: string | null
          contributor_first_name?: string | null
          contributor_id?: string | null
          contributor_last_name?: string | null
          contributor_middle_name?: string | null
          contributor_name?: string | null
          contributor_occupation?: string | null
          contributor_prefix?: string | null
          contributor_state?: string | null
          contributor_street_1?: string | null
          contributor_street_2?: string | null
          contributor_suffix?: string | null
          contributor_zip?: string | null
          created_at?: string | null
          donor_committee_name?: string | null
          election_type?: string | null
          election_type_full?: string | null
          entity_type?: string | null
          entity_type_desc?: string | null
          fec_election_type_desc?: string | null
          fec_election_year?: number | null
          file_number?: number | null
          id?: string
          image_number?: string | null
          increased_limit?: string | null
          is_individual?: boolean | null
          line_number?: string | null
          line_number_label?: string | null
          load_date?: string | null
          memo_code?: string | null
          memo_text?: string | null
          memoed_subtotal?: boolean | null
          national_committee_nonfederal_account?: string | null
          original_sub_id?: string | null
          pdf_url?: string | null
          receipt_type?: string | null
          receipt_type_full?: string | null
          report_type?: string | null
          report_year?: number | null
          schedule_type?: string | null
          schedule_type_full?: string | null
          sub_id?: string
          transaction_id?: string | null
          two_year_transaction_period?: number | null
        }
        Relationships: []
      }
      pac_contributions_senate: {
        Row: {
          candidate_id: string | null
          candidate_name: string | null
          org_c: number | null
          org_candidate: number | null
          org_joint: number | null
          org_l: number | null
          org_leadership: number | null
          org_lobbyist: number | null
          org_m: number | null
          org_party: number | null
          org_presidential: number | null
          org_t: number | null
          org_u: number | null
          org_v: number | null
          org_w: number | null
          total_2020_2024: number | null
        }
        Insert: {
          candidate_id?: string | null
          candidate_name?: string | null
          org_c?: number | null
          org_candidate?: number | null
          org_joint?: number | null
          org_l?: number | null
          org_leadership?: number | null
          org_lobbyist?: number | null
          org_m?: number | null
          org_party?: number | null
          org_presidential?: number | null
          org_t?: number | null
          org_u?: number | null
          org_v?: number | null
          org_w?: number | null
          total_2020_2024?: number | null
        }
        Update: {
          candidate_id?: string | null
          candidate_name?: string | null
          org_c?: number | null
          org_candidate?: number | null
          org_joint?: number | null
          org_l?: number | null
          org_leadership?: number | null
          org_lobbyist?: number | null
          org_m?: number | null
          org_party?: number | null
          org_presidential?: number | null
          org_t?: number | null
          org_u?: number | null
          org_v?: number | null
          org_w?: number | null
          total_2020_2024?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pac_contributions_senate_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_assets"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "pac_contributions_senate_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_committee_fundraising"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "pac_contributions_senate_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pac_contributions_senate_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "crypto_exec_candidate_totals"
            referencedColumns: ["candidate_uuid"]
          },
          {
            foreignKeyName: "pac_contributions_senate_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "earmarked_by_candidate"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "pac_contributions_senate_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "extension_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pac_contributions_senate_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "grade_inputs"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "pac_contributions_senate_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pac_cycle_recipients"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "pac_contributions_senate_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pro_israel_pac_candidate_totals"
            referencedColumns: ["candidate_id"]
          },
        ]
      }
      pac_master: {
        Row: {
          cand_id: string | null
          cmte_city: string | null
          cmte_dsgn: string | null
          cmte_filing_freq: string | null
          cmte_id: string | null
          cmte_nm: string | null
          cmte_pty_affiliation: string | null
          cmte_st: string | null
          cmte_st1: string | null
          cmte_st2: string | null
          cmte_tp: string | null
          cmte_zip: string | null
          connected_org_nm: string | null
          created_at: string | null
          id: string
          org_tp: string | null
          tres_nm: string | null
        }
        Insert: {
          cand_id?: string | null
          cmte_city?: string | null
          cmte_dsgn?: string | null
          cmte_filing_freq?: string | null
          cmte_id?: string | null
          cmte_nm?: string | null
          cmte_pty_affiliation?: string | null
          cmte_st?: string | null
          cmte_st1?: string | null
          cmte_st2?: string | null
          cmte_tp?: string | null
          cmte_zip?: string | null
          connected_org_nm?: string | null
          created_at?: string | null
          id?: string
          org_tp?: string | null
          tres_nm?: string | null
        }
        Update: {
          cand_id?: string | null
          cmte_city?: string | null
          cmte_dsgn?: string | null
          cmte_filing_freq?: string | null
          cmte_id?: string | null
          cmte_nm?: string | null
          cmte_pty_affiliation?: string | null
          cmte_st?: string | null
          cmte_st1?: string | null
          cmte_st2?: string | null
          cmte_tp?: string | null
          cmte_zip?: string | null
          connected_org_nm?: string | null
          created_at?: string | null
          id?: string
          org_tp?: string | null
          tres_nm?: string | null
        }
        Relationships: []
      }
      pac_refunds_master: {
        Row: {
          amendment_indicator: string | null
          beneficiary_committee_name: string | null
          candidate_id: string | null
          candidate_id_fec: string | null
          candidate_name: string | null
          candidate_office: string | null
          candidate_office_district: string | null
          candidate_office_state: string | null
          category_code: string | null
          category_code_full: string | null
          comm_dt: string | null
          committee_id: string | null
          conduit_committee_city: string | null
          conduit_committee_name: string | null
          conduit_committee_state: string | null
          conduit_committee_zip: string | null
          created_at: string | null
          disbursement_amount: number
          disbursement_date: string | null
          disbursement_description: string | null
          disbursement_purpose_category: string | null
          disbursement_type: string | null
          disbursement_type_description: string | null
          election_type: string | null
          election_type_full: string | null
          entity_type: string | null
          entity_type_desc: string | null
          fec_election_year: number | null
          file_number: number | null
          id: string
          image_number: string | null
          line_number: string | null
          line_number_label: string | null
          load_date: string | null
          memo_code: string | null
          memo_code_full: string | null
          memo_text: string | null
          memoed_subtotal: boolean | null
          payee_employer: string | null
          payee_first_name: string | null
          payee_last_name: string | null
          payee_middle_name: string | null
          payee_occupation: string | null
          payee_prefix: string | null
          payee_suffix: string | null
          pdf_url: string | null
          recipient_city: string | null
          recipient_committee_id: string | null
          recipient_name: string | null
          recipient_state: string | null
          recipient_zip: string | null
          ref_disp_excess_flg: string | null
          report_type: string | null
          report_year: number | null
          semi_annual_bundled_refund: number | null
          spender_committee_designation: string | null
          spender_committee_org_type: string | null
          spender_committee_type: string | null
          sub_id: string
          transaction_id: string | null
          two_year_transaction_period: number | null
        }
        Insert: {
          amendment_indicator?: string | null
          beneficiary_committee_name?: string | null
          candidate_id?: string | null
          candidate_id_fec?: string | null
          candidate_name?: string | null
          candidate_office?: string | null
          candidate_office_district?: string | null
          candidate_office_state?: string | null
          category_code?: string | null
          category_code_full?: string | null
          comm_dt?: string | null
          committee_id?: string | null
          conduit_committee_city?: string | null
          conduit_committee_name?: string | null
          conduit_committee_state?: string | null
          conduit_committee_zip?: string | null
          created_at?: string | null
          disbursement_amount: number
          disbursement_date?: string | null
          disbursement_description?: string | null
          disbursement_purpose_category?: string | null
          disbursement_type?: string | null
          disbursement_type_description?: string | null
          election_type?: string | null
          election_type_full?: string | null
          entity_type?: string | null
          entity_type_desc?: string | null
          fec_election_year?: number | null
          file_number?: number | null
          id?: string
          image_number?: string | null
          line_number?: string | null
          line_number_label?: string | null
          load_date?: string | null
          memo_code?: string | null
          memo_code_full?: string | null
          memo_text?: string | null
          memoed_subtotal?: boolean | null
          payee_employer?: string | null
          payee_first_name?: string | null
          payee_last_name?: string | null
          payee_middle_name?: string | null
          payee_occupation?: string | null
          payee_prefix?: string | null
          payee_suffix?: string | null
          pdf_url?: string | null
          recipient_city?: string | null
          recipient_committee_id?: string | null
          recipient_name?: string | null
          recipient_state?: string | null
          recipient_zip?: string | null
          ref_disp_excess_flg?: string | null
          report_type?: string | null
          report_year?: number | null
          semi_annual_bundled_refund?: number | null
          spender_committee_designation?: string | null
          spender_committee_org_type?: string | null
          spender_committee_type?: string | null
          sub_id: string
          transaction_id?: string | null
          two_year_transaction_period?: number | null
        }
        Update: {
          amendment_indicator?: string | null
          beneficiary_committee_name?: string | null
          candidate_id?: string | null
          candidate_id_fec?: string | null
          candidate_name?: string | null
          candidate_office?: string | null
          candidate_office_district?: string | null
          candidate_office_state?: string | null
          category_code?: string | null
          category_code_full?: string | null
          comm_dt?: string | null
          committee_id?: string | null
          conduit_committee_city?: string | null
          conduit_committee_name?: string | null
          conduit_committee_state?: string | null
          conduit_committee_zip?: string | null
          created_at?: string | null
          disbursement_amount?: number
          disbursement_date?: string | null
          disbursement_description?: string | null
          disbursement_purpose_category?: string | null
          disbursement_type?: string | null
          disbursement_type_description?: string | null
          election_type?: string | null
          election_type_full?: string | null
          entity_type?: string | null
          entity_type_desc?: string | null
          fec_election_year?: number | null
          file_number?: number | null
          id?: string
          image_number?: string | null
          line_number?: string | null
          line_number_label?: string | null
          load_date?: string | null
          memo_code?: string | null
          memo_code_full?: string | null
          memo_text?: string | null
          memoed_subtotal?: boolean | null
          payee_employer?: string | null
          payee_first_name?: string | null
          payee_last_name?: string | null
          payee_middle_name?: string | null
          payee_occupation?: string | null
          payee_prefix?: string | null
          payee_suffix?: string | null
          pdf_url?: string | null
          recipient_city?: string | null
          recipient_committee_id?: string | null
          recipient_name?: string | null
          recipient_state?: string | null
          recipient_zip?: string | null
          ref_disp_excess_flg?: string | null
          report_type?: string | null
          report_year?: number | null
          semi_annual_bundled_refund?: number | null
          spender_committee_designation?: string | null
          spender_committee_org_type?: string | null
          spender_committee_type?: string | null
          sub_id?: string
          transaction_id?: string | null
          two_year_transaction_period?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pac_refunds_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_assets"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_pac_refunds_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_committee_fundraising"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_pac_refunds_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pac_refunds_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "crypto_exec_candidate_totals"
            referencedColumns: ["candidate_uuid"]
          },
          {
            foreignKeyName: "fk_pac_refunds_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "earmarked_by_candidate"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_pac_refunds_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "extension_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pac_refunds_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "grade_inputs"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_pac_refunds_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pac_cycle_recipients"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_pac_refunds_candidate"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "pro_israel_pac_candidate_totals"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "fk_pac_refunds_committee"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "pac_contributions_by_year"
            referencedColumns: ["pac_id"]
          },
          {
            foreignKeyName: "fk_pac_refunds_committee"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "pac_master"
            referencedColumns: ["cmte_id"]
          },
          {
            foreignKeyName: "fk_pac_refunds_recipient_committee"
            columns: ["recipient_committee_id"]
            isOneToOne: false
            referencedRelation: "pac_contributions_by_year"
            referencedColumns: ["pac_id"]
          },
          {
            foreignKeyName: "fk_pac_refunds_recipient_committee"
            columns: ["recipient_committee_id"]
            isOneToOne: false
            referencedRelation: "pac_master"
            referencedColumns: ["cmte_id"]
          },
        ]
      }
      password_reset_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token_hash: string
          used: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          token_hash: string
          used?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token_hash?: string
          used?: boolean
          user_id?: string
        }
        Relationships: []
      }
      posting_lock: {
        Row: {
          id: number
          locked_until: string
        }
        Insert: {
          id?: number
          locked_until?: string
        }
        Update: {
          id?: number
          locked_until?: string
        }
        Relationships: []
      }
      predictions: {
        Row: {
          created_at: string | null
          id: string
          predicted_candidate_id: string
          race_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          predicted_candidate_id: string
          race_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          predicted_candidate_id?: string
          race_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "predictions_predicted_candidate_id_fkey"
            columns: ["predicted_candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_assets"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "predictions_predicted_candidate_id_fkey"
            columns: ["predicted_candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_committee_fundraising"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "predictions_predicted_candidate_id_fkey"
            columns: ["predicted_candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "predictions_predicted_candidate_id_fkey"
            columns: ["predicted_candidate_id"]
            isOneToOne: false
            referencedRelation: "crypto_exec_candidate_totals"
            referencedColumns: ["candidate_uuid"]
          },
          {
            foreignKeyName: "predictions_predicted_candidate_id_fkey"
            columns: ["predicted_candidate_id"]
            isOneToOne: false
            referencedRelation: "earmarked_by_candidate"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "predictions_predicted_candidate_id_fkey"
            columns: ["predicted_candidate_id"]
            isOneToOne: false
            referencedRelation: "extension_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "predictions_predicted_candidate_id_fkey"
            columns: ["predicted_candidate_id"]
            isOneToOne: false
            referencedRelation: "grade_inputs"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "predictions_predicted_candidate_id_fkey"
            columns: ["predicted_candidate_id"]
            isOneToOne: false
            referencedRelation: "pac_cycle_recipients"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "predictions_predicted_candidate_id_fkey"
            columns: ["predicted_candidate_id"]
            isOneToOne: false
            referencedRelation: "pro_israel_pac_candidate_totals"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "predictions_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["race_id"]
          },
        ]
      }
      primary_polling: {
        Row: {
          avg_pct: number
          candidate_name: string
          created_at: string
          date: string
          id: string
          party: string
          poll_count: number
          source: string
        }
        Insert: {
          avg_pct: number
          candidate_name: string
          created_at?: string
          date: string
          id?: string
          party: string
          poll_count?: number
          source?: string
        }
        Update: {
          avg_pct?: number
          candidate_name?: string
          created_at?: string
          date?: string
          id?: string
          party?: string
          poll_count?: number
          source?: string
        }
        Relationships: []
      }
      primary_predictions: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean | null
          party: string
          predicted_candidate_id: string
          race_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct?: boolean | null
          party: string
          predicted_candidate_id: string
          race_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean | null
          party?: string
          predicted_candidate_id?: string
          race_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "primary_predictions_predicted_candidate_id_fkey"
            columns: ["predicted_candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_assets"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "primary_predictions_predicted_candidate_id_fkey"
            columns: ["predicted_candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_committee_fundraising"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "primary_predictions_predicted_candidate_id_fkey"
            columns: ["predicted_candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "primary_predictions_predicted_candidate_id_fkey"
            columns: ["predicted_candidate_id"]
            isOneToOne: false
            referencedRelation: "crypto_exec_candidate_totals"
            referencedColumns: ["candidate_uuid"]
          },
          {
            foreignKeyName: "primary_predictions_predicted_candidate_id_fkey"
            columns: ["predicted_candidate_id"]
            isOneToOne: false
            referencedRelation: "earmarked_by_candidate"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "primary_predictions_predicted_candidate_id_fkey"
            columns: ["predicted_candidate_id"]
            isOneToOne: false
            referencedRelation: "extension_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "primary_predictions_predicted_candidate_id_fkey"
            columns: ["predicted_candidate_id"]
            isOneToOne: false
            referencedRelation: "grade_inputs"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "primary_predictions_predicted_candidate_id_fkey"
            columns: ["predicted_candidate_id"]
            isOneToOne: false
            referencedRelation: "pac_cycle_recipients"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "primary_predictions_predicted_candidate_id_fkey"
            columns: ["predicted_candidate_id"]
            isOneToOne: false
            referencedRelation: "pro_israel_pac_candidate_totals"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "primary_predictions_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["race_id"]
          },
        ]
      }
      principal_committee_ids_new: {
        Row: {
          affiliated_committee_name: string | null
          candidate_ids: string | null
          committee_id: string
          committee_type: string | null
          committee_type_full: string | null
          created_at: string | null
          cycles: string | null
          designation: string | null
          designation_full: string | null
          filing_frequency: string | null
          first_f1_date: string | null
          first_file_date: string | null
          id: string
          last_f1_date: string | null
          last_file_date: string | null
          name: string | null
          organization_type: string | null
          organization_type_full: string | null
          party: string | null
          party_full: string | null
          sponsor_candidate_ids: string | null
          sponsor_candidate_list: string | null
          state: string | null
          treasurer_name: string | null
        }
        Insert: {
          affiliated_committee_name?: string | null
          candidate_ids?: string | null
          committee_id: string
          committee_type?: string | null
          committee_type_full?: string | null
          created_at?: string | null
          cycles?: string | null
          designation?: string | null
          designation_full?: string | null
          filing_frequency?: string | null
          first_f1_date?: string | null
          first_file_date?: string | null
          id?: string
          last_f1_date?: string | null
          last_file_date?: string | null
          name?: string | null
          organization_type?: string | null
          organization_type_full?: string | null
          party?: string | null
          party_full?: string | null
          sponsor_candidate_ids?: string | null
          sponsor_candidate_list?: string | null
          state?: string | null
          treasurer_name?: string | null
        }
        Update: {
          affiliated_committee_name?: string | null
          candidate_ids?: string | null
          committee_id?: string
          committee_type?: string | null
          committee_type_full?: string | null
          created_at?: string | null
          cycles?: string | null
          designation?: string | null
          designation_full?: string | null
          filing_frequency?: string | null
          first_f1_date?: string | null
          first_file_date?: string | null
          id?: string
          last_f1_date?: string | null
          last_file_date?: string | null
          name?: string | null
          organization_type?: string | null
          organization_type_full?: string | null
          party?: string | null
          party_full?: string | null
          sponsor_candidate_ids?: string | null
          sponsor_candidate_list?: string | null
          state?: string | null
          treasurer_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_principal_committee_candidate"
            columns: ["candidate_ids"]
            isOneToOne: false
            referencedRelation: "ai_exec_candidate_totals"
            referencedColumns: ["candidate_fec_id"]
          },
          {
            foreignKeyName: "fk_principal_committee_candidate"
            columns: ["candidate_ids"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["fec_id"]
          },
          {
            foreignKeyName: "fk_principal_committee_candidate"
            columns: ["candidate_ids"]
            isOneToOne: false
            referencedRelation: "crypto_exec_candidate_totals"
            referencedColumns: ["candidate_fec_id"]
          },
          {
            foreignKeyName: "fk_principal_committee_pac_master"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "pac_contributions_by_year"
            referencedColumns: ["pac_id"]
          },
          {
            foreignKeyName: "fk_principal_committee_pac_master"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "pac_master"
            referencedColumns: ["cmte_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      race_polling: {
        Row: {
          candidate_a_name: string | null
          candidate_a_party: string | null
          candidate_a_pct: number | null
          candidate_b_name: string | null
          candidate_b_party: string | null
          candidate_b_pct: number | null
          created_at: string
          id: string
          last_updated: string
          race_id: string
          raw_data: Json | null
          rcp_url: string
          spread: string | null
        }
        Insert: {
          candidate_a_name?: string | null
          candidate_a_party?: string | null
          candidate_a_pct?: number | null
          candidate_b_name?: string | null
          candidate_b_party?: string | null
          candidate_b_pct?: number | null
          created_at?: string
          id?: string
          last_updated?: string
          race_id: string
          raw_data?: Json | null
          rcp_url: string
          spread?: string | null
        }
        Update: {
          candidate_a_name?: string | null
          candidate_a_party?: string | null
          candidate_a_pct?: number | null
          candidate_b_name?: string | null
          candidate_b_party?: string | null
          candidate_b_pct?: number | null
          created_at?: string
          id?: string
          last_updated?: string
          race_id?: string
          raw_data?: Json | null
          rcp_url?: string
          spread?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "race_polling_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["race_id"]
          },
        ]
      }
      races: {
        Row: {
          cook_pvi: string | null
          cook_pvi_score: number | null
          district: string | null
          featured: boolean | null
          featured_type: string | null
          kalshi_event_ticker: string | null
          margin: number | null
          polymarket_slug: string | null
          pres_2020_dem: number | null
          pres_2020_margin: number | null
          pres_2020_rep: number | null
          pres_2024_dem: number | null
          pres_2024_margin: number | null
          pres_2024_rep: number | null
          primary_date: string | null
          race_id: string
          rcp_url: string | null
          runnerup_name: string | null
          runnerup_party: string | null
          runnerup_pct: number | null
          runnerup_votes: number | null
          slug: string | null
          state: string | null
          total_votes: number | null
          winner_name: string | null
          winner_party: string | null
          winner_pct: number | null
          winner_votes: number | null
          year: number | null
        }
        Insert: {
          cook_pvi?: string | null
          cook_pvi_score?: number | null
          district?: string | null
          featured?: boolean | null
          featured_type?: string | null
          kalshi_event_ticker?: string | null
          margin?: number | null
          polymarket_slug?: string | null
          pres_2020_dem?: number | null
          pres_2020_margin?: number | null
          pres_2020_rep?: number | null
          pres_2024_dem?: number | null
          pres_2024_margin?: number | null
          pres_2024_rep?: number | null
          primary_date?: string | null
          race_id?: string
          rcp_url?: string | null
          runnerup_name?: string | null
          runnerup_party?: string | null
          runnerup_pct?: number | null
          runnerup_votes?: number | null
          slug?: string | null
          state?: string | null
          total_votes?: number | null
          winner_name?: string | null
          winner_party?: string | null
          winner_pct?: number | null
          winner_votes?: number | null
          year?: number | null
        }
        Update: {
          cook_pvi?: string | null
          cook_pvi_score?: number | null
          district?: string | null
          featured?: boolean | null
          featured_type?: string | null
          kalshi_event_ticker?: string | null
          margin?: number | null
          polymarket_slug?: string | null
          pres_2020_dem?: number | null
          pres_2020_margin?: number | null
          pres_2020_rep?: number | null
          pres_2024_dem?: number | null
          pres_2024_margin?: number | null
          pres_2024_rep?: number | null
          primary_date?: string | null
          race_id?: string
          rcp_url?: string | null
          runnerup_name?: string | null
          runnerup_party?: string | null
          runnerup_pct?: number | null
          runnerup_votes?: number | null
          slug?: string | null
          state?: string | null
          total_votes?: number | null
          winner_name?: string | null
          winner_party?: string | null
          winner_pct?: number | null
          winner_votes?: number | null
          year?: number | null
        }
        Relationships: []
      }
      senate_candidates_fec_matched: {
        Row: {
          fec_id: string | null
          fec_name: string | null
          fec_state: string | null
          match_score: number | null
          matched: boolean | null
          senate_filer_name: string | null
          senate_filer_state: string | null
        }
        Insert: {
          fec_id?: string | null
          fec_name?: string | null
          fec_state?: string | null
          match_score?: number | null
          matched?: boolean | null
          senate_filer_name?: string | null
          senate_filer_state?: string | null
        }
        Update: {
          fec_id?: string | null
          fec_name?: string | null
          fec_state?: string | null
          match_score?: number | null
          matched?: boolean | null
          senate_filer_name?: string | null
          senate_filer_state?: string | null
        }
        Relationships: []
      }
      senate_summaries_2: {
        Row: {
          all_other_loans: number | null
          candidate_id: string | null
          cmte_transfers: number | null
          committee_name: string | null
          contribution_refunds: number | null
          contributions: number | null
          disbursements: number | null
          individual_itemized_contributions: number | null
          individual_raised: number | null
          last_debts_owed_by_committee: number | null
          last_debts_owed_to_committee: number | null
          loan_repayments: number | null
          loan_repayments_candidate_loans: number | null
          loan_repayments_other_loans: number | null
          loans: number | null
          loans_made_by_candidate: number | null
          net_contributions: number | null
          other_receipts: number | null
          pac_raised: number | null
          political_party_committee_contributions: number | null
          refunded_individual_contributions: number | null
          refunded_other_political_committee_contributions: number | null
          refunded_political_party_committee_contributions: number | null
          self_raised: number | null
          small_dollar_raised: number | null
          total_raised: number | null
          transfers_to_other_authorized_committee: number | null
        }
        Insert: {
          all_other_loans?: number | null
          candidate_id?: string | null
          cmte_transfers?: number | null
          committee_name?: string | null
          contribution_refunds?: number | null
          contributions?: number | null
          disbursements?: number | null
          individual_itemized_contributions?: number | null
          individual_raised?: number | null
          last_debts_owed_by_committee?: number | null
          last_debts_owed_to_committee?: number | null
          loan_repayments?: number | null
          loan_repayments_candidate_loans?: number | null
          loan_repayments_other_loans?: number | null
          loans?: number | null
          loans_made_by_candidate?: number | null
          net_contributions?: number | null
          other_receipts?: number | null
          pac_raised?: number | null
          political_party_committee_contributions?: number | null
          refunded_individual_contributions?: number | null
          refunded_other_political_committee_contributions?: number | null
          refunded_political_party_committee_contributions?: number | null
          self_raised?: number | null
          small_dollar_raised?: number | null
          total_raised?: number | null
          transfers_to_other_authorized_committee?: number | null
        }
        Update: {
          all_other_loans?: number | null
          candidate_id?: string | null
          cmte_transfers?: number | null
          committee_name?: string | null
          contribution_refunds?: number | null
          contributions?: number | null
          disbursements?: number | null
          individual_itemized_contributions?: number | null
          individual_raised?: number | null
          last_debts_owed_by_committee?: number | null
          last_debts_owed_to_committee?: number | null
          loan_repayments?: number | null
          loan_repayments_candidate_loans?: number | null
          loan_repayments_other_loans?: number | null
          loans?: number | null
          loans_made_by_candidate?: number | null
          net_contributions?: number | null
          other_receipts?: number | null
          pac_raised?: number | null
          political_party_committee_contributions?: number | null
          refunded_individual_contributions?: number | null
          refunded_other_political_committee_contributions?: number | null
          refunded_political_party_committee_contributions?: number | null
          self_raised?: number | null
          small_dollar_raised?: number | null
          total_raised?: number | null
          transfers_to_other_authorized_committee?: number | null
        }
        Relationships: []
      }
      shoutouts: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      social_posts: {
        Row: {
          bluesky_cid: string | null
          bluesky_uri: string | null
          created_at: string
          id: string
          platform: string
          post_text: string
          post_type: string
          posted_at: string
          reference_ids: string[]
        }
        Insert: {
          bluesky_cid?: string | null
          bluesky_uri?: string | null
          created_at?: string
          id?: string
          platform?: string
          post_text: string
          post_type: string
          posted_at?: string
          reference_ids?: string[]
        }
        Update: {
          bluesky_cid?: string | null
          bluesky_uri?: string | null
          created_at?: string
          id?: string
          platform?: string
          post_text?: string
          post_type?: string
          posted_at?: string
          reference_ids?: string[]
        }
        Relationships: []
      }
      stock_price_cache: {
        Row: {
          created_at: string | null
          expires_at: string
          fetched_at: string
          id: string
          metadata: Json | null
          prices: Json
          range: string
          ticker: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          fetched_at?: string
          id?: string
          metadata?: Json | null
          prices: Json
          range: string
          ticker: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          fetched_at?: string
          id?: string
          metadata?: Json | null
          prices?: Json
          range?: string
          ticker?: string
        }
        Relationships: []
      }
      stock_tickers: {
        Row: {
          cik: number
          industry: string | null
          sector: string | null
          sic: number | null
          state_of_inc: string | null
          ticker: string
          title: string
        }
        Insert: {
          cik: number
          industry?: string | null
          sector?: string | null
          sic?: number | null
          state_of_inc?: string | null
          ticker: string
          title: string
        }
        Update: {
          cik?: number
          industry?: string | null
          sector?: string | null
          sic?: number | null
          state_of_inc?: string | null
          ticker?: string
          title?: string
        }
        Relationships: []
      }
      tracked_bills: {
        Row: {
          active: boolean
          bill_number: number
          bill_type: string
          category: string
          congress: number
          congress_url: string | null
          created_at: string
          id: number
          label: string
          last_cosponsor_count: number | null
          last_sync_at: string | null
          title: string | null
        }
        Insert: {
          active?: boolean
          bill_number: number
          bill_type: string
          category: string
          congress: number
          congress_url?: string | null
          created_at?: string
          id?: number
          label: string
          last_cosponsor_count?: number | null
          last_sync_at?: string | null
          title?: string | null
        }
        Update: {
          active?: boolean
          bill_number?: number
          bill_type?: string
          category?: string
          congress?: number
          congress_url?: string | null
          created_at?: string
          id?: number
          label?: string
          last_cosponsor_count?: number | null
          last_sync_at?: string | null
          title?: string | null
        }
        Relationships: []
      }
      trump_tracker: {
        Row: {
          account: string | null
          asset_type: string | null
          cabinet_id: string | null
          created_at: string | null
          description: string | null
          eif: string | null
          filing_date: string | null
          income_amount: string | null
          income_avg: number | null
          income_max: number | null
          income_min: number | null
          income_type: string | null
          is_dupe: boolean | null
          item_no: number | null
          ownership_percent: string | null
          source_page_index: number | null
          underlying_asset: string | null
          updated_at: string | null
          uuid: string
          value: string | null
          value_avg: number | null
          value_max: number | null
          value_min: number | null
          year_reported: number | null
        }
        Insert: {
          account?: string | null
          asset_type?: string | null
          cabinet_id?: string | null
          created_at?: string | null
          description?: string | null
          eif?: string | null
          filing_date?: string | null
          income_amount?: string | null
          income_avg?: number | null
          income_max?: number | null
          income_min?: number | null
          income_type?: string | null
          is_dupe?: boolean | null
          item_no?: number | null
          ownership_percent?: string | null
          source_page_index?: number | null
          underlying_asset?: string | null
          updated_at?: string | null
          uuid?: string
          value?: string | null
          value_avg?: number | null
          value_max?: number | null
          value_min?: number | null
          year_reported?: number | null
        }
        Update: {
          account?: string | null
          asset_type?: string | null
          cabinet_id?: string | null
          created_at?: string | null
          description?: string | null
          eif?: string | null
          filing_date?: string | null
          income_amount?: string | null
          income_avg?: number | null
          income_max?: number | null
          income_min?: number | null
          income_type?: string | null
          is_dupe?: boolean | null
          item_no?: number | null
          ownership_percent?: string | null
          source_page_index?: number | null
          underlying_asset?: string | null
          updated_at?: string | null
          uuid?: string
          value?: string | null
          value_avg?: number | null
          value_max?: number | null
          value_min?: number | null
          year_reported?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      ai_exec_candidate_totals: {
        Row: {
          candidate_fec_id: string | null
          candidate_name: string | null
          candidate_uuid: string | null
          chamber: string | null
          contribution_count: number | null
          district: string | null
          lastElected: string | null
          numeric_grade: number | null
          party: string | null
          photo_url: string | null
          slug: string | null
          state: string | null
          status: string | null
          total: number | null
        }
        Relationships: []
      }
      ca_contributions_summary: {
        Row: {
          as_of: string | null
          candidate_id: string | null
          committee_filer_id: number | null
          cycle: string | null
          individual_contributions: number | null
          individual_donor_count: number | null
          name: string | null
          pac_contributions: number | null
          party_contributions: number | null
          slug: string | null
          small_dollar_contributions: number | null
          small_dollar_count: number | null
          total_raised: number | null
        }
        Relationships: []
      }
      ca_ie_by_candidate: {
        Row: {
          as_of: string | null
          candidate_id: string | null
          committee_count: number | null
          cycle: string | null
          name: string | null
          opposing_count: number | null
          slug: string | null
          supporting_count: number | null
          total_opposing: number | null
          total_supporting: number | null
        }
        Relationships: []
      }
      cabinet_member_summary: {
        Row: {
          asset_type_count: number | null
          assets_by_type: Json | null
          cabinet_id: string | null
          earliest_trade: string | null
          executive_level: string | null
          headshot_url: string | null
          id: number | null
          latest_trade: string | null
          liabilities: Json | null
          name: string | null
          position: string | null
          positions_held: Json | null
          purchases: number | null
          recent_trades: Json | null
          salary: number | null
          sales: number | null
          top_assets: Json | null
          total_asset_value: number | null
          total_assets: number | null
          total_liabilities: number | null
          total_liability_value: number | null
          total_positions: number | null
          total_trade_value: number | null
          total_trades: number | null
          unique_tickers: number | null
        }
        Relationships: []
      }
      candidate_assets: {
        Row: {
          asset_type_count: number | null
          assets_by_type: Json | null
          candidate_id: string | null
          candidate_name: string | null
          canonical_candidate_id: string | null
          chamber: string | null
          party: string | null
          state: string | null
          stock_count: number | null
          stock_holdings: Json | null
          top_assets: Json | null
          total_assets: number | null
          total_value_avg: number | null
          total_value_max: number | null
          total_value_min: number | null
          year: string | null
        }
        Relationships: []
      }
      candidate_committee_fundraising: {
        Row: {
          candidate_contribution: number | null
          candidate_id: string | null
          candidate_name: string | null
          canonical_candidate_id: string | null
          cash_on_hand: number | null
          chamber: string | null
          committee_id: string | null
          committee_name: string | null
          contributions_by_size: Json | null
          contributions_by_state: Json | null
          cycle: number | null
          debts_owed: number | null
          direct_pac_contributions: number | null
          disbursements: number | null
          individual_contributions: number | null
          individual_itemized_contributions: number | null
          individual_unitemized_contributions: number | null
          loans_made_by_candidate: number | null
          net_contributions: number | null
          operating_expenditures: number | null
          other_receipts: number | null
          pac_contributions: number | null
          pac_contributions_by_org_type: Json | null
          party: string | null
          party_contributions: number | null
          state: string | null
          top_earmark_conduits: Json | null
          top_pacs: Json | null
          total_contributions: number | null
          transfers_from_other_authorized_committee: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_committee_totals_committee"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "pac_contributions_by_year"
            referencedColumns: ["pac_id"]
          },
          {
            foreignKeyName: "fk_committee_totals_committee"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "pac_master"
            referencedColumns: ["cmte_id"]
          },
        ]
      }
      committee_pac_donors: {
        Row: {
          committee_id: string | null
          contributor_id: string | null
          contributor_name: string | null
          member_count: number | null
          total_amount: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pac_contributions_contributor"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "pac_contributions_by_year"
            referencedColumns: ["pac_id"]
          },
          {
            foreignKeyName: "fk_pac_contributions_contributor"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "pac_master"
            referencedColumns: ["cmte_id"]
          },
        ]
      }
      committee_stock_holdings: {
        Row: {
          committee_id: string | null
          company_name: string | null
          holder_count: number | null
          sector: string | null
          ticker: string | null
          total_value: number | null
        }
        Relationships: []
      }
      committee_trades: {
        Row: {
          amount: string | null
          bioguide_id: string | null
          committee_id: string | null
          description: string | null
          member_slug: string | null
          party: string | null
          representative: string | null
          state: string | null
          ticker: string | null
          trade_id: string | null
          transaction_date: string | null
          transaction_type: string | null
        }
        Relationships: [
          {
            foreignKeyName: "congress_trades_bioguide_id_fkey"
            columns: ["bioguide_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["bioguide_id"]
          },
        ]
      }
      company_board_members_detail: {
        Row: {
          candidate_id: string | null
          candidate_name: string | null
          chamber: string | null
          company_id: string | null
          company_name: string | null
          from_date: string | null
          is_current: boolean | null
          party: string | null
          position_title: string | null
          source: string | null
          state: string | null
          ticker: string | null
          to_date: string | null
        }
        Relationships: []
      }
      company_pac_stockholders: {
        Row: {
          board_member_count: number | null
          cik: string | null
          company_id: string | null
          company_name: string | null
          donation_relationships: number | null
          headquarters_city: string | null
          headquarters_state: string | null
          industry: string | null
          lobbying_relationships: number | null
          pac_contributions: Json | null
          pac_count: number | null
          pacs: Json | null
          parent_company_id: string | null
          sector: string | null
          stockholder_count: number | null
          stockholders: Json | null
          ticker: string | null
          website: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "company_board_members_detail"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "companies_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "company_pac_stockholders"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "companies_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "company_pacs_detail"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "companies_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "company_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "company_stockholders_detail"
            referencedColumns: ["company_id"]
          },
        ]
      }
      company_pacs_detail: {
        Row: {
          company_id: string | null
          company_name: string | null
          created_at: string | null
          pac_cmte_id: string | null
          pac_name: string | null
          pac_type: string | null
          party: string | null
          relationship_type: string | null
          source: string | null
          ticker: string | null
        }
        Relationships: []
      }
      company_profiles: {
        Row: {
          board_member_count: number | null
          cik: string | null
          created_at: string | null
          current_board_members: number | null
          donation_relationships: number | null
          headquarters_city: string | null
          headquarters_state: string | null
          id: string | null
          industry: string | null
          littlesis_id: number | null
          lobbying_relationships: number | null
          name: string | null
          pac_count: number | null
          parent_company_id: string | null
          politician_stockholders: number | null
          sector: string | null
          ticker: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          board_member_count?: never
          cik?: string | null
          created_at?: string | null
          current_board_members?: never
          donation_relationships?: never
          headquarters_city?: string | null
          headquarters_state?: string | null
          id?: string | null
          industry?: string | null
          littlesis_id?: number | null
          lobbying_relationships?: never
          name?: string | null
          pac_count?: never
          parent_company_id?: string | null
          politician_stockholders?: never
          sector?: string | null
          ticker?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          board_member_count?: never
          cik?: string | null
          created_at?: string | null
          current_board_members?: never
          donation_relationships?: never
          headquarters_city?: string | null
          headquarters_state?: string | null
          id?: string | null
          industry?: string | null
          littlesis_id?: number | null
          lobbying_relationships?: never
          name?: string | null
          pac_count?: never
          parent_company_id?: string | null
          politician_stockholders?: never
          sector?: string | null
          ticker?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "company_board_members_detail"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "companies_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "company_pac_stockholders"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "companies_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "company_pacs_detail"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "companies_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "company_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "company_stockholders_detail"
            referencedColumns: ["company_id"]
          },
        ]
      }
      company_stockholders_detail: {
        Row: {
          candidate_id: string | null
          candidate_name: string | null
          chamber: string | null
          company_id: string | null
          company_name: string | null
          filing_year: number | null
          party: string | null
          source: string | null
          state: string | null
          ticker: string | null
          value_max: number | null
          value_min: number | null
        }
        Relationships: []
      }
      crypto_exec_candidate_totals: {
        Row: {
          candidate_fec_id: string | null
          candidate_name: string | null
          candidate_uuid: string | null
          chamber: string | null
          contribution_count: number | null
          district: string | null
          lastElected: string | null
          numeric_grade: number | null
          party: string | null
          photo_url: string | null
          slug: string | null
          state: string | null
          status: string | null
          total: number | null
        }
        Relationships: []
      }
      earmarked_by_candidate: {
        Row: {
          avg_contribution: number | null
          candidate_id: string | null
          candidate_name: string | null
          chamber: string | null
          committee_id: string | null
          cycle: number | null
          max_contribution: number | null
          party: string | null
          state: string | null
          top_sources: Json | null
          total_amount: number | null
          total_contributions: number | null
          unique_sources: number | null
        }
        Relationships: []
      }
      earmarked_by_pac: {
        Row: {
          avg_contribution: number | null
          committee_type: string | null
          cycle: number | null
          max_contribution: number | null
          pac_id: string | null
          pac_name: string | null
          party_affiliation: string | null
          top_recipients: Json | null
          total_amount: number | null
          total_contributions: number | null
          unique_recipients: number | null
        }
        Relationships: []
      }
      economy_history_pivoted: {
        Row: {
          all_loans_delinquency: number | null
          auto_insurance: number | null
          bacon: number | null
          bananas: number | null
          beef: number | null
          bread: number | null
          building_permits: number | null
          business_loan_delinquency: number | null
          cable_streaming: number | null
          car_parts: number | null
          cheddar_cheese: number | null
          chicken: number | null
          childcare_education: number | null
          clothing: number | null
          coffee: number | null
          concrete: number | null
          core_inflation_sticky: number | null
          credit_card_delinquency: number | null
          date: string | null
          debt_held_by_public: number | null
          disposable_income_share: number | null
          econ_index: number | null
          eggs: number | null
          fed_funds_rate: number | null
          federal_deficit: number | null
          federal_revenue: number | null
          federal_spending: number | null
          flour: number | null
          food_away_from_home: number | null
          food_overall: number | null
          furniture: number | null
          health_insurance_ppi: number | null
          home_insurance: number | null
          housing_affordability_index: number | null
          internet_it: number | null
          intragovernmental_holdings: number | null
          job_openings: number | null
          lettuce: number | null
          lumber: number | null
          median_home_value: number | null
          median_household_income: number | null
          medical_care: number | null
          milk: number | null
          mortgage_delinquency: number | null
          mortgage_rate: number | null
          national_debt: number | null
          natural_gas: number | null
          new_construction_inventory: number | null
          new_home_sale_price: number | null
          oranges: number | null
          personal_care: number | null
          potato_chips: number | null
          potatoes: number | null
          power_per_kwh: number | null
          public_transit: number | null
          rent: number | null
          rental_vacancy_rate: number | null
          rice: number | null
          shingles: number | null
          steel: number | null
          sugar: number | null
          temp_help_employment: number | null
          tomatoes: number | null
          total_inventory: number | null
          trash_collection_ppi: number | null
          treasury_10yr: number | null
          u6_unemployment: number | null
          unemployment_rate: number | null
          used_car: number | null
          water_sewer_trash: number | null
        }
        Relationships: []
      }
      extension_candidates: {
        Row: {
          chamber: string | null
          citizens_united_pledge: boolean | null
          district: string | null
          firstElected: string | null
          id: string | null
          linked_candidate_id: string | null
          name: string | null
          net_worth: number | null
          no_lobbyist_pledge: boolean | null
          no_pac_pledge: boolean | null
          no_trading_pledge: boolean | null
          numeric_grade: number | null
          party: string | null
          photo_url: string | null
          slug: string | null
          state: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_linked_candidate_id_fkey"
            columns: ["linked_candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_assets"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "candidates_linked_candidate_id_fkey"
            columns: ["linked_candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_committee_fundraising"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "candidates_linked_candidate_id_fkey"
            columns: ["linked_candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidates_linked_candidate_id_fkey"
            columns: ["linked_candidate_id"]
            isOneToOne: false
            referencedRelation: "crypto_exec_candidate_totals"
            referencedColumns: ["candidate_uuid"]
          },
          {
            foreignKeyName: "candidates_linked_candidate_id_fkey"
            columns: ["linked_candidate_id"]
            isOneToOne: false
            referencedRelation: "earmarked_by_candidate"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "candidates_linked_candidate_id_fkey"
            columns: ["linked_candidate_id"]
            isOneToOne: false
            referencedRelation: "extension_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidates_linked_candidate_id_fkey"
            columns: ["linked_candidate_id"]
            isOneToOne: false
            referencedRelation: "grade_inputs"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "candidates_linked_candidate_id_fkey"
            columns: ["linked_candidate_id"]
            isOneToOne: false
            referencedRelation: "pac_cycle_recipients"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "candidates_linked_candidate_id_fkey"
            columns: ["linked_candidate_id"]
            isOneToOne: false
            referencedRelation: "pro_israel_pac_candidate_totals"
            referencedColumns: ["candidate_id"]
          },
        ]
      }
      grade_inputs: {
        Row: {
          bill_citizens_united: boolean | null
          bill_lobby_ban: boolean | null
          bill_stock_ban: boolean | null
          candidate_id: string | null
          chamber: string | null
          current_grade: number | null
          donor_large_pct: number | null
          donor_medium_pct: number | null
          donor_small_pct: number | null
          donor_xlarge_pct: number | null
          donor_xxlarge_pct: number | null
          dont_count_stocks: boolean | null
          earmark_total: number | null
          elected_year: number | null
          has_2024_financials: boolean | null
          is_incumbent: boolean | null
          name: string | null
          no_corp_pac: boolean | null
          no_stocks: boolean | null
          pac_corporate: number | null
          pac_ideological: number | null
          pac_lobbyist: number | null
          pac_other: number | null
          pac_pct: number | null
          pac_political: number | null
          pac_trade: number | null
          pac_union: number | null
          party: string | null
          pledge_citizens_united: boolean | null
          pledge_no_pac: boolean | null
          pledge_revolving_door: boolean | null
          pledge_stock_ban: boolean | null
          state: string | null
          stock_avg: number | null
          trade_count: number | null
          trade_value_total: number | null
          type: string | null
        }
        Relationships: []
      }
      independent_expenditures_by_committee: {
        Row: {
          candidates_targeted: number | null
          committee_id: string | null
          committee_name: string | null
          first_expenditure: string | null
          last_expenditure: string | null
          races_involved: number | null
          total_oppose: number | null
          total_spent: number | null
          total_support: number | null
          transaction_count: number | null
        }
        Relationships: []
      }
      pac_contribs_by_committee: {
        Row: {
          cnt: number | null
          committee_id: string | null
          cycle: number | null
          org_type: string | null
          total: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pac_contributions_committee"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "pac_contributions_by_year"
            referencedColumns: ["pac_id"]
          },
          {
            foreignKeyName: "fk_pac_contributions_committee"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "pac_master"
            referencedColumns: ["cmte_id"]
          },
        ]
      }
      pac_contribs_by_contributor: {
        Row: {
          committee_id: string | null
          contributor_id: string | null
          contributor_name: string | null
          cycle: number | null
          org_type: string | null
          total: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pac_contributions_committee"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "pac_contributions_by_year"
            referencedColumns: ["pac_id"]
          },
          {
            foreignKeyName: "fk_pac_contributions_committee"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "pac_master"
            referencedColumns: ["cmte_id"]
          },
          {
            foreignKeyName: "fk_pac_contributions_contributor"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "pac_contributions_by_year"
            referencedColumns: ["pac_id"]
          },
          {
            foreignKeyName: "fk_pac_contributions_contributor"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "pac_master"
            referencedColumns: ["cmte_id"]
          },
        ]
      }
      pac_contributions_by_year: {
        Row: {
          avg_contribution: number | null
          connected_org: string | null
          contributions_by_party: Json | null
          cycle: number | null
          earmarked_amount: number | null
          earmarked_contributions: number | null
          max_contribution: number | null
          org_type: string | null
          pac_id: string | null
          pac_name: string | null
          pac_state: string | null
          party_affiliation: string | null
          top_recipients: Json | null
          total_amount: number | null
          total_contributions: number | null
          unique_candidates: number | null
          unique_recipients: number | null
        }
        Relationships: []
      }
      pac_cycle_party_breakdown: {
        Row: {
          contribution_count: number | null
          cycle: number | null
          pac_id: string | null
          party: string | null
          total_amount: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pac_contributions_contributor"
            columns: ["pac_id"]
            isOneToOne: false
            referencedRelation: "pac_contributions_by_year"
            referencedColumns: ["pac_id"]
          },
          {
            foreignKeyName: "fk_pac_contributions_contributor"
            columns: ["pac_id"]
            isOneToOne: false
            referencedRelation: "pac_master"
            referencedColumns: ["cmte_id"]
          },
        ]
      }
      pac_cycle_recipients: {
        Row: {
          candidate_id: string | null
          candidate_name: string | null
          chamber: string | null
          committee_id: string | null
          contribution_count: number | null
          cycle: number | null
          pac_id: string | null
          party: string | null
          state: string | null
          total_amount: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pac_contributions_committee"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "pac_contributions_by_year"
            referencedColumns: ["pac_id"]
          },
          {
            foreignKeyName: "fk_pac_contributions_committee"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "pac_master"
            referencedColumns: ["cmte_id"]
          },
          {
            foreignKeyName: "fk_pac_contributions_contributor"
            columns: ["pac_id"]
            isOneToOne: false
            referencedRelation: "pac_contributions_by_year"
            referencedColumns: ["pac_id"]
          },
          {
            foreignKeyName: "fk_pac_contributions_contributor"
            columns: ["pac_id"]
            isOneToOne: false
            referencedRelation: "pac_master"
            referencedColumns: ["cmte_id"]
          },
        ]
      }
      pac_cycle_totals: {
        Row: {
          avg_contribution: number | null
          cycle: number | null
          max_contribution: number | null
          pac_id: string | null
          total_amount: number | null
          total_contributions: number | null
          unique_candidates: number | null
          unique_recipients: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pac_contributions_contributor"
            columns: ["pac_id"]
            isOneToOne: false
            referencedRelation: "pac_contributions_by_year"
            referencedColumns: ["pac_id"]
          },
          {
            foreignKeyName: "fk_pac_contributions_contributor"
            columns: ["pac_id"]
            isOneToOne: false
            referencedRelation: "pac_master"
            referencedColumns: ["cmte_id"]
          },
        ]
      }
      pro_israel_pac_candidate_totals: {
        Row: {
          candidate_id: string | null
          candidate_name: string | null
          chamber: string | null
          committee_id: string | null
          contributions_by_pac: Json | null
          cycle: number | null
          party: string | null
          state: string | null
          total_amount: number | null
          total_count: number | null
          total_direct: number | null
          total_earmarked: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      acquire_posting_lock: {
        Args: { lock_duration_minutes?: number }
        Returns: boolean
      }
      apply_candidate_grades: {
        Args: { p_chamber?: string; p_cycle?: number }
        Returns: number
      }
      calculate_candidate_grades: {
        Args: { p_chamber?: string; p_cycle?: number; p_dry_run?: boolean }
        Returns: {
          candidate_id: string
          candidate_name: string
          computed_letter_grade: string
          ethical_bonus: number
          individual_donor_score: number
          pac_penalty: number
          pledge_bonus: number
          raw_score: number
          stock_penalty: number
          total_score: number
        }[]
      }
      cleanup_stock_price_cache: { Args: never; Returns: undefined }
      extract_stock_ticker: { Args: { asset_name: string }; Returns: string }
      find_company_by_name: { Args: { search_name: string }; Returns: string }
      find_company_by_ticker: {
        Args: { search_ticker: string }
        Returns: string
      }
      get_asset_code: { Args: { raw_type: string }; Returns: string }
      get_committee_contribution_total: {
        Args: { p_committee_id: string }
        Returns: number
      }
      get_extension_candidates: {
        Args: never
        Returns: {
          chamber: string
          citizens_united_pledge: boolean
          district: string
          id: string
          name: string
          net_worth: number
          no_lobbyist_pledge: boolean
          no_pac_pledge: boolean
          no_trading_pledge: boolean
          numeric_grade: number
          party: string
          photo_url: string
          slug: string
          state: string
        }[]
      }
      get_pac_contributions_by_category: {
        Args: { p_candidate_id: string; p_fec_election_year?: number }
        Returns: {
          org_type: string
          pac_count: number
          total_amount: number
        }[]
      }
      get_pac_statistics: {
        Args: { p_year?: number }
        Returns: {
          candidate_count: number
          contributor_id: string
          total_amount: number
        }[]
      }
      get_stock_holdings_summary: {
        Args: never
        Returns: {
          asset_name: string
          holders: Json
          ticker: string
          total_amount: number
          total_holders: number
        }[]
      }
      get_top_pacs_for_candidate: {
        Args: {
          p_candidate_id: string
          p_fec_election_year?: number
          p_limit?: number
          p_org_type?: string
        }
        Returns: {
          contributor_id: string
          contributor_name: string
          org_type: string
          total_amount: number
        }[]
      }
      get_user_id_by_email: { Args: { lookup_email: string }; Returns: string }
      normalize_company_name: { Args: { input_name: string }; Returns: string }
      parse_value_range: {
        Args: { value_text: string }
        Returns: {
          val_avg: number
          val_max: number
          val_min: number
        }[]
      }
      refresh_candidate_assets: { Args: never; Returns: undefined }
      refresh_candidate_committee_fundraising: {
        Args: never
        Returns: undefined
      }
      refresh_committee_financials: { Args: never; Returns: undefined }
      refresh_economy_history_pivoted: { Args: never; Returns: undefined }
      refresh_independent_expenditures_by_committee: {
        Args: never
        Returns: undefined
      }
      release_posting_lock: { Args: never; Returns: undefined }
      remove_feedback_vote: {
        Args: { p_fingerprint: string; p_post_id: string }
        Returns: boolean
      }
      search_candidates: {
        Args: { result_limit?: number; search_query: string }
        Returns: {
          chamber: string
          district: string
          id: string
          name: string
          numeric_grade: number
          party: string
          photo_url: string
          slug: string
          state: string
          status: string
        }[]
      }
      search_races: {
        Args: { result_limit?: number; search_query: string }
        Returns: {
          display_name: string
          district: string
          race_id: string
          similarity_score: number
          slug: string
          state: string
          year: number
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      strip_middle_initials: { Args: { input: string }; Returns: string }
      strip_name_titles: { Args: { input: string }; Returns: string }
      upsert_gp_snapshot: { Args: { rows: Json }; Returns: number }
      upvote_feedback: {
        Args: { p_fingerprint: string; p_post_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
