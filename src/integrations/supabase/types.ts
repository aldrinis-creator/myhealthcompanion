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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_goals: {
        Row: {
          auto_adjust: boolean
          created_at: string
          daily_active_minutes_goal: number
          daily_move_hours_goal: number
          daily_steps_goal: number
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_adjust?: boolean
          created_at?: string
          daily_active_minutes_goal?: number
          daily_move_hours_goal?: number
          daily_steps_goal?: number
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_adjust?: boolean
          created_at?: string
          daily_active_minutes_goal?: number
          daily_move_hours_goal?: number
          daily_steps_goal?: number
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      activity_sessions: {
        Row: {
          avg_heart_rate: number | null
          cadence_avg: number | null
          calories_estimated: number | null
          created_at: string
          distance_meters: number | null
          duration_seconds: number | null
          ended_at: string | null
          floors_climbed: number | null
          heart_rate_readings: Json | null
          id: string
          is_active: boolean | null
          max_heart_rate: number | null
          min_heart_rate: number | null
          respiratory_rate: number | null
          spo2: number | null
          started_at: string
          steps: number | null
          user_id: string
        }
        Insert: {
          avg_heart_rate?: number | null
          cadence_avg?: number | null
          calories_estimated?: number | null
          created_at?: string
          distance_meters?: number | null
          duration_seconds?: number | null
          ended_at?: string | null
          floors_climbed?: number | null
          heart_rate_readings?: Json | null
          id?: string
          is_active?: boolean | null
          max_heart_rate?: number | null
          min_heart_rate?: number | null
          respiratory_rate?: number | null
          spo2?: number | null
          started_at?: string
          steps?: number | null
          user_id: string
        }
        Update: {
          avg_heart_rate?: number | null
          cadence_avg?: number | null
          calories_estimated?: number | null
          created_at?: string
          distance_meters?: number | null
          duration_seconds?: number | null
          ended_at?: string | null
          floors_climbed?: number | null
          heart_rate_readings?: Json | null
          id?: string
          is_active?: boolean | null
          max_heart_rate?: number | null
          min_heart_rate?: number | null
          respiratory_rate?: number | null
          spo2?: number | null
          started_at?: string
          steps?: number | null
          user_id?: string
        }
        Relationships: []
      }
      ai_rate_limits: {
        Row: {
          feature: string
          id: string
          used_at: string
          user_id: string
        }
        Insert: {
          feature: string
          id?: string
          used_at?: string
          user_id: string
        }
        Update: {
          feature?: string
          id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: []
      }
      analysis_feedback: {
        Row: {
          analysis_snippet: string | null
          created_at: string
          description: string
          document_type: string
          id: string
          issue_type: string
          reviewed_at: string | null
          reviewer_notes: string | null
          status: string
          user_id: string
        }
        Insert: {
          analysis_snippet?: string | null
          created_at?: string
          description: string
          document_type: string
          id?: string
          issue_type: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: string
          user_id: string
        }
        Update: {
          analysis_snippet?: string | null
          created_at?: string
          description?: string
          document_type?: string
          id?: string
          issue_type?: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          alarm_enabled: boolean
          alarm_sound: string
          appointment_date: string
          appointment_time: string
          appointment_type: string
          confirmation_token: string | null
          created_at: string
          description: string | null
          doctor_name: string | null
          doctor_proposed_date: string | null
          doctor_proposed_time: string | null
          doctor_response_note: string | null
          doctor_status: string | null
          end_date: string | null
          end_time: string | null
          first_alert_minutes: number
          id: string
          is_dismissed: boolean
          location: string | null
          max_snoozes: number
          recurrence: string
          recurrence_parent_id: string | null
          second_alert_minutes: number | null
          snooze_count: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          alarm_enabled?: boolean
          alarm_sound?: string
          appointment_date: string
          appointment_time: string
          appointment_type?: string
          confirmation_token?: string | null
          created_at?: string
          description?: string | null
          doctor_name?: string | null
          doctor_proposed_date?: string | null
          doctor_proposed_time?: string | null
          doctor_response_note?: string | null
          doctor_status?: string | null
          end_date?: string | null
          end_time?: string | null
          first_alert_minutes?: number
          id?: string
          is_dismissed?: boolean
          location?: string | null
          max_snoozes?: number
          recurrence?: string
          recurrence_parent_id?: string | null
          second_alert_minutes?: number | null
          snooze_count?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          alarm_enabled?: boolean
          alarm_sound?: string
          appointment_date?: string
          appointment_time?: string
          appointment_type?: string
          confirmation_token?: string | null
          created_at?: string
          description?: string | null
          doctor_name?: string | null
          doctor_proposed_date?: string | null
          doctor_proposed_time?: string | null
          doctor_response_note?: string | null
          doctor_status?: string | null
          end_date?: string | null
          end_time?: string | null
          first_alert_minutes?: number
          id?: string
          is_dismissed?: boolean
          location?: string | null
          max_snoozes?: number
          recurrence?: string
          recurrence_parent_id?: string | null
          second_alert_minutes?: number | null
          snooze_count?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bioequivalent_cache: {
        Row: {
          alternatives: Json
          created_at: string
          expires_at: string
          form: string
          id: string
          medicine_key: string
          original_name: string
          salt_composition: string
          strength: string
        }
        Insert: {
          alternatives?: Json
          created_at?: string
          expires_at?: string
          form: string
          id?: string
          medicine_key: string
          original_name: string
          salt_composition: string
          strength: string
        }
        Update: {
          alternatives?: Json
          created_at?: string
          expires_at?: string
          form?: string
          id?: string
          medicine_key?: string
          original_name?: string
          salt_composition?: string
          strength?: string
        }
        Relationships: []
      }
      care_journal_entries: {
        Row: {
          author_id: string
          author_role: string
          category: string
          content: string
          created_at: string
          id: string
          is_pinned: boolean
          user_id: string
        }
        Insert: {
          author_id: string
          author_role?: string
          category?: string
          content: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          user_id: string
        }
        Update: {
          author_id?: string
          author_role?: string
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          user_id?: string
        }
        Relationships: []
      }
      contact_us: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          responded_at: string | null
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          responded_at?: string | null
          status?: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          responded_at?: string | null
          status?: string
          subject?: string
        }
        Relationships: []
      }
      daily_health_passport: {
        Row: {
          activity_score: number
          bonus_points: number
          checkin_score: number
          created_at: string
          id: string
          medication_score: number
          passport_date: string
          streak_days: number
          total_score: number
          trend: string
          updated_at: string
          user_id: string
          vitals_score: number
          wellness_score: number
        }
        Insert: {
          activity_score?: number
          bonus_points?: number
          checkin_score?: number
          created_at?: string
          id?: string
          medication_score?: number
          passport_date?: string
          streak_days?: number
          total_score?: number
          trend?: string
          updated_at?: string
          user_id: string
          vitals_score?: number
          wellness_score?: number
        }
        Update: {
          activity_score?: number
          bonus_points?: number
          checkin_score?: number
          created_at?: string
          id?: string
          medication_score?: number
          passport_date?: string
          streak_days?: number
          total_score?: number
          trend?: string
          updated_at?: string
          user_id?: string
          vitals_score?: number
          wellness_score?: number
        }
        Relationships: []
      }
      data_privacy_requests: {
        Row: {
          admin_notes: string | null
          correction_field: string | null
          correction_value: string | null
          created_at: string
          details: string | null
          id: string
          request_type: string
          responded_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          correction_field?: string | null
          correction_value?: string | null
          created_at?: string
          details?: string | null
          id?: string
          request_type: string
          responded_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          correction_field?: string | null
          correction_value?: string | null
          created_at?: string
          details?: string | null
          id?: string
          request_type?: string
          responded_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      death_verifications: {
        Row: {
          approved_at: string | null
          cause_of_death: string | null
          created_at: string
          date_of_death: string | null
          death_certificate_uploaded_at: string | null
          death_certificate_url: string | null
          deceased_user_id: string
          funeral_date: string | null
          funeral_location: string | null
          id: string
          initiated_by_guardian_id: string
          rejected_at: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewer_notes: string | null
          status: string
          updated_at: string
          vault_release_token: string | null
          vault_released_at: string | null
          witness_1_government_id_type: string | null
          witness_1_name: string | null
          witness_1_relationship: string | null
          witness_1_submitted_at: string | null
          witness_1_video_url: string | null
          witness_2_government_id_type: string | null
          witness_2_name: string | null
          witness_2_relationship: string | null
          witness_2_submitted_at: string | null
          witness_2_video_url: string | null
        }
        Insert: {
          approved_at?: string | null
          cause_of_death?: string | null
          created_at?: string
          date_of_death?: string | null
          death_certificate_uploaded_at?: string | null
          death_certificate_url?: string | null
          deceased_user_id: string
          funeral_date?: string | null
          funeral_location?: string | null
          id?: string
          initiated_by_guardian_id: string
          rejected_at?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: string
          updated_at?: string
          vault_release_token?: string | null
          vault_released_at?: string | null
          witness_1_government_id_type?: string | null
          witness_1_name?: string | null
          witness_1_relationship?: string | null
          witness_1_submitted_at?: string | null
          witness_1_video_url?: string | null
          witness_2_government_id_type?: string | null
          witness_2_name?: string | null
          witness_2_relationship?: string | null
          witness_2_submitted_at?: string | null
          witness_2_video_url?: string | null
        }
        Update: {
          approved_at?: string | null
          cause_of_death?: string | null
          created_at?: string
          date_of_death?: string | null
          death_certificate_uploaded_at?: string | null
          death_certificate_url?: string | null
          deceased_user_id?: string
          funeral_date?: string | null
          funeral_location?: string | null
          id?: string
          initiated_by_guardian_id?: string
          rejected_at?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: string
          updated_at?: string
          vault_release_token?: string | null
          vault_released_at?: string | null
          witness_1_government_id_type?: string | null
          witness_1_name?: string | null
          witness_1_relationship?: string | null
          witness_1_submitted_at?: string | null
          witness_1_video_url?: string | null
          witness_2_government_id_type?: string | null
          witness_2_name?: string | null
          witness_2_relationship?: string | null
          witness_2_submitted_at?: string | null
          witness_2_video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "death_verifications_initiated_by_guardian_id_fkey"
            columns: ["initiated_by_guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_usage: {
        Row: {
          feature: string
          id: string
          used_at: string
          user_id: string
        }
        Insert: {
          feature: string
          id?: string
          used_at?: string
          user_id: string
        }
        Update: {
          feature?: string
          id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: []
      }
      guardian_ambulance_requests: {
        Row: {
          acknowledged_at: string | null
          ambulance_lat: number | null
          ambulance_lng: number | null
          contact_number: string | null
          created_at: string | null
          distance_km: number | null
          emergency_type: string | null
          estimated_fare: number | null
          expires_at: string | null
          guardian_id: string | null
          id: string
          latitude: number | null
          longitude: number | null
          patient_name: string | null
          pickup_address: string | null
          pickup_landmark: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          acknowledged_at?: string | null
          ambulance_lat?: number | null
          ambulance_lng?: number | null
          contact_number?: string | null
          created_at?: string | null
          distance_km?: number | null
          emergency_type?: string | null
          estimated_fare?: number | null
          expires_at?: string | null
          guardian_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          patient_name?: string | null
          pickup_address?: string | null
          pickup_landmark?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          acknowledged_at?: string | null
          ambulance_lat?: number | null
          ambulance_lng?: number | null
          contact_number?: string | null
          created_at?: string | null
          distance_km?: number | null
          emergency_type?: string | null
          estimated_fare?: number | null
          expires_at?: string | null
          guardian_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          patient_name?: string | null
          pickup_address?: string | null
          pickup_landmark?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guardian_ambulance_requests_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
        ]
      }
      guardian_exchanges: {
        Row: {
          created_at: string | null
          exchange_type: string
          expires_at: string | null
          guardian_id: string | null
          id: string
          location_url: string | null
          message: string | null
          resolved_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          exchange_type: string
          expires_at?: string | null
          guardian_id?: string | null
          id?: string
          location_url?: string | null
          message?: string | null
          resolved_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          exchange_type?: string
          expires_at?: string | null
          guardian_id?: string | null
          id?: string
          location_url?: string | null
          message?: string | null
          resolved_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guardian_exchanges_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
        ]
      }
      guardians: {
        Row: {
          created_at: string
          email: string | null
          expires_at: string | null
          guardian_user_id: string | null
          id: string
          is_vault_nominee: boolean | null
          last_reminder_at: string | null
          name: string
          nomination_sent_at: string | null
          phone: string | null
          reminder_count: number | null
          responded_at: string | null
          response_token: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          expires_at?: string | null
          guardian_user_id?: string | null
          id?: string
          is_vault_nominee?: boolean | null
          last_reminder_at?: string | null
          name: string
          nomination_sent_at?: string | null
          phone?: string | null
          reminder_count?: number | null
          responded_at?: string | null
          response_token?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          expires_at?: string | null
          guardian_user_id?: string | null
          id?: string
          is_vault_nominee?: boolean | null
          last_reminder_at?: string | null
          name?: string
          nomination_sent_at?: string | null
          phone?: string | null
          reminder_count?: number | null
          responded_at?: string | null
          response_token?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      health_personas: {
        Row: {
          activity_context: string | null
          analysis_style: string | null
          created_at: string
          dietary_framework: string | null
          id: string
          medical_considerations: string[] | null
          nutritional_focus: string | null
          primary_goal: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_context?: string | null
          analysis_style?: string | null
          created_at?: string
          dietary_framework?: string | null
          id?: string
          medical_considerations?: string[] | null
          nutritional_focus?: string | null
          primary_goal?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_context?: string | null
          analysis_style?: string | null
          created_at?: string
          dietary_framework?: string | null
          id?: string
          medical_considerations?: string[] | null
          nutritional_focus?: string | null
          primary_goal?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      health_scans: {
        Row: {
          created_at: string
          encouragement: string | null
          hydration_score: number | null
          id: string
          image_url: string | null
          raw_response: Json | null
          rest_score: number | null
          user_id: string
          vitality_score: number | null
        }
        Insert: {
          created_at?: string
          encouragement?: string | null
          hydration_score?: number | null
          id?: string
          image_url?: string | null
          raw_response?: Json | null
          rest_score?: number | null
          user_id: string
          vitality_score?: number | null
        }
        Update: {
          created_at?: string
          encouragement?: string | null
          hydration_score?: number | null
          id?: string
          image_url?: string | null
          raw_response?: Json | null
          rest_score?: number | null
          user_id?: string
          vitality_score?: number | null
        }
        Relationships: []
      }
      important_contacts: {
        Row: {
          created_at: string
          first_name: string
          id: string
          last_name: string | null
          mobile_country_code: string
          mobile_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          first_name: string
          id?: string
          last_name?: string | null
          mobile_country_code?: string
          mobile_number: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string | null
          mobile_country_code?: string
          mobile_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      important_documents: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          page_urls: string[]
          remarks: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          page_urls?: string[]
          remarks?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          page_urls?: string[]
          remarks?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      loyalty_points: {
        Row: {
          created_at: string
          description: string
          id: string
          points: number
          source: string
          source_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          points: number
          source: string
          source_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          points?: number
          source?: string
          source_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      medical_documents: {
        Row: {
          created_at: string
          description: string | null
          document_date: string | null
          document_type: Database["public"]["Enums"]["medical_document_type"]
          file_name: string
          file_size_bytes: number | null
          file_url: string
          id: string
          provider_name: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_date?: string | null
          document_type?: Database["public"]["Enums"]["medical_document_type"]
          file_name: string
          file_size_bytes?: number | null
          file_url: string
          id?: string
          provider_name?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          document_date?: string | null
          document_type?: Database["public"]["Enums"]["medical_document_type"]
          file_name?: string
          file_size_bytes?: number | null
          file_url?: string
          id?: string
          provider_name?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      medication_logs: {
        Row: {
          created_at: string
          id: string
          medication_id: string
          scheduled_at: string
          snooze_count: number
          snoozed_until: string | null
          status: string
          taken_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          medication_id: string
          scheduled_at: string
          snooze_count?: number
          snoozed_until?: string | null
          status?: string
          taken_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          medication_id?: string
          scheduled_at?: string
          snooze_count?: number
          snoozed_until?: string | null
          status?: string
          taken_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_logs_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          composition: string | null
          created_at: string
          current_quantity: number | null
          dosage: string
          id: string
          is_active: boolean | null
          last_refilled_at: string | null
          low_stock_threshold: number | null
          name: string
          scheduled_time: string
          scheduled_times: string[] | null
          severity: string
          total_quantity: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          composition?: string | null
          created_at?: string
          current_quantity?: number | null
          dosage: string
          id?: string
          is_active?: boolean | null
          last_refilled_at?: string | null
          low_stock_threshold?: number | null
          name: string
          scheduled_time: string
          scheduled_times?: string[] | null
          severity?: string
          total_quantity?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          composition?: string | null
          created_at?: string
          current_quantity?: number | null
          dosage?: string
          id?: string
          is_active?: boolean | null
          last_refilled_at?: string | null
          low_stock_threshold?: number | null
          name?: string
          scheduled_time?: string
          scheduled_times?: string[] | null
          severity?: string
          total_quantity?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      operation_allergies: {
        Row: {
          case_id: string
          created_at: string
          id: string
          reaction: string | null
          substance: string
          user_id: string
        }
        Insert: {
          case_id: string
          created_at?: string
          id?: string
          reaction?: string | null
          substance: string
          user_id: string
        }
        Update: {
          case_id?: string
          created_at?: string
          id?: string
          reaction?: string | null
          substance?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "operation_allergies_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "operation_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      operation_cases: {
        Row: {
          background: string | null
          case_type: string
          created_at: string
          diagnosis: string | null
          fasting_required: boolean | null
          fasting_start_date: string | null
          follow_up_date: string | null
          follow_up_time: string | null
          id: string
          npo_status: string | null
          npo_time: string | null
          operation_date: string | null
          operation_time: string | null
          pre_op_weight: number | null
          recommendations: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          background?: string | null
          case_type?: string
          created_at?: string
          diagnosis?: string | null
          fasting_required?: boolean | null
          fasting_start_date?: string | null
          follow_up_date?: string | null
          follow_up_time?: string | null
          id?: string
          npo_status?: string | null
          npo_time?: string | null
          operation_date?: string | null
          operation_time?: string | null
          pre_op_weight?: number | null
          recommendations?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          background?: string | null
          case_type?: string
          created_at?: string
          diagnosis?: string | null
          fasting_required?: boolean | null
          fasting_start_date?: string | null
          follow_up_date?: string | null
          follow_up_time?: string | null
          id?: string
          npo_status?: string | null
          npo_time?: string | null
          operation_date?: string | null
          operation_time?: string | null
          pre_op_weight?: number | null
          recommendations?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      operation_checklist: {
        Row: {
          case_id: string
          category: string
          checked: boolean | null
          created_at: string
          id: string
          item_key: string
          label: string
          user_id: string
        }
        Insert: {
          case_id: string
          category: string
          checked?: boolean | null
          created_at?: string
          id?: string
          item_key: string
          label: string
          user_id: string
        }
        Update: {
          case_id?: string
          category?: string
          checked?: boolean | null
          created_at?: string
          id?: string
          item_key?: string
          label?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "operation_checklist_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "operation_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      operation_medications: {
        Row: {
          case_id: string
          created_at: string
          dosage: string | null
          id: string
          med_type: string | null
          name: string
          user_id: string
        }
        Insert: {
          case_id: string
          created_at?: string
          dosage?: string | null
          id?: string
          med_type?: string | null
          name: string
          user_id: string
        }
        Update: {
          case_id?: string
          created_at?: string
          dosage?: string | null
          id?: string
          med_type?: string | null
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "operation_medications_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "operation_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      operation_site_checks: {
        Row: {
          case_id: string
          check_date: string
          created_at: string
          dizziness: boolean | null
          excess_motions: boolean | null
          excess_urination: boolean | null
          feel_tired: boolean | null
          id: string
          mobility_met: boolean | null
          nausea: boolean | null
          poor_sleep: boolean | null
          redness: boolean | null
          remarks: string | null
          swelling: boolean | null
          unusual_discharge: boolean | null
          updated_at: string
          user_id: string
          vomiting: boolean | null
        }
        Insert: {
          case_id: string
          check_date: string
          created_at?: string
          dizziness?: boolean | null
          excess_motions?: boolean | null
          excess_urination?: boolean | null
          feel_tired?: boolean | null
          id?: string
          mobility_met?: boolean | null
          nausea?: boolean | null
          poor_sleep?: boolean | null
          redness?: boolean | null
          remarks?: string | null
          swelling?: boolean | null
          unusual_discharge?: boolean | null
          updated_at?: string
          user_id: string
          vomiting?: boolean | null
        }
        Update: {
          case_id?: string
          check_date?: string
          created_at?: string
          dizziness?: boolean | null
          excess_motions?: boolean | null
          excess_urination?: boolean | null
          feel_tired?: boolean | null
          id?: string
          mobility_met?: boolean | null
          nausea?: boolean | null
          poor_sleep?: boolean | null
          redness?: boolean | null
          remarks?: string | null
          swelling?: boolean | null
          unusual_discharge?: boolean | null
          updated_at?: string
          user_id?: string
          vomiting?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "operation_site_checks_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "operation_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      operation_vitals: {
        Row: {
          bp: string | null
          case_id: string
          created_at: string
          heart_rate: string | null
          id: string
          pain_level: string | null
          record_date: string
          spo2: string | null
          sugar: string | null
          temperature: string | null
          temperature_unit: string | null
          updated_at: string
          user_id: string
          weight: string | null
        }
        Insert: {
          bp?: string | null
          case_id: string
          created_at?: string
          heart_rate?: string | null
          id?: string
          pain_level?: string | null
          record_date: string
          spo2?: string | null
          sugar?: string | null
          temperature?: string | null
          temperature_unit?: string | null
          updated_at?: string
          user_id: string
          weight?: string | null
        }
        Update: {
          bp?: string | null
          case_id?: string
          created_at?: string
          heart_rate?: string | null
          id?: string
          pain_level?: string | null
          record_date?: string
          spo2?: string | null
          sugar?: string | null
          temperature?: string | null
          temperature_unit?: string | null
          updated_at?: string
          user_id?: string
          weight?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "operation_vitals_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "operation_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_otps: {
        Row: {
          attempts: number
          created_at: string
          expires_at: string
          id: string
          is_signup: boolean
          otp_hash: string
          phone: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          expires_at: string
          id?: string
          is_signup?: boolean
          otp_hash: string
          phone: string
        }
        Update: {
          attempts?: number
          created_at?: string
          expires_at?: string
          id?: string
          is_signup?: boolean
          otp_hash?: string
          phone?: string
        }
        Relationships: []
      }
      prize_catalog: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          image_emoji: string
          is_active: boolean
          is_milestone_reward: boolean
          milestone_threshold: number | null
          name: string
          points_cost: number
          stock_remaining: number | null
          tier: string
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          id?: string
          image_emoji?: string
          is_active?: boolean
          is_milestone_reward?: boolean
          milestone_threshold?: number | null
          name: string
          points_cost: number
          stock_remaining?: number | null
          tier?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          image_emoji?: string
          is_active?: boolean
          is_milestone_reward?: boolean
          milestone_threshold?: number | null
          name?: string
          points_cost?: number
          stock_remaining?: number | null
          tier?: string
        }
        Relationships: []
      }
      prize_redemptions: {
        Row: {
          fulfilled_at: string | null
          id: string
          points_spent: number
          prize_id: string
          redeemed_at: string
          status: string
          user_id: string
        }
        Insert: {
          fulfilled_at?: string | null
          id?: string
          points_spent: number
          prize_id: string
          redeemed_at?: string
          status?: string
          user_id: string
        }
        Update: {
          fulfilled_at?: string | null
          id?: string
          points_spent?: number
          prize_id?: string
          redeemed_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prize_redemptions_prize_id_fkey"
            columns: ["prize_id"]
            isOneToOne: false
            referencedRelation: "prize_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          aadhaar_card_image_url: string | null
          aadhaar_number_encrypted: string | null
          aadhaar_number_iv: string | null
          allergies: string[] | null
          appointment_pre_alert_minutes: number
          avatar_url: string | null
          blood_type: string | null
          car_insurance_company: string | null
          car_insurance_expiry: string | null
          car_insurance_phone: string | null
          car_insurance_policy_number: string | null
          created_at: string
          date_of_birth: string | null
          display_name: string | null
          doctor_mobile: string | null
          doctor_name: string | null
          emergency_contact_2_name: string | null
          emergency_contact_2_phone: string | null
          emergency_contact_3_name: string | null
          emergency_contact_3_phone: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          first_name: string | null
          food_preference: string | null
          gender: string | null
          health_insurance_company: string | null
          health_insurance_expiry: string | null
          health_insurance_phone: string | null
          health_insurance_policy_number: string | null
          height_cm: number | null
          id: string
          last_name: string | null
          life_insurance_company: string | null
          life_insurance_expiry: string | null
          life_insurance_phone: string | null
          life_insurance_policy_number: string | null
          medical_conditions: string[] | null
          medication_window_minutes: number
          mobile_country_code: string | null
          mobile_number: string | null
          nudge_interval_hours: number
          pan_card_image_url: string | null
          pan_number_encrypted: string | null
          pan_number_iv: string | null
          preferred_language: string | null
          profile_completed_at: string | null
          profile_pin_hash: string | null
          profile_pin_salt: string | null
          profile_reminder_count: number | null
          profile_reminder_dismissed_at: string | null
          updated_at: string
          user_id: string
          weekly_report_enabled: boolean
          weight_kg: number | null
        }
        Insert: {
          aadhaar_card_image_url?: string | null
          aadhaar_number_encrypted?: string | null
          aadhaar_number_iv?: string | null
          allergies?: string[] | null
          appointment_pre_alert_minutes?: number
          avatar_url?: string | null
          blood_type?: string | null
          car_insurance_company?: string | null
          car_insurance_expiry?: string | null
          car_insurance_phone?: string | null
          car_insurance_policy_number?: string | null
          created_at?: string
          date_of_birth?: string | null
          display_name?: string | null
          doctor_mobile?: string | null
          doctor_name?: string | null
          emergency_contact_2_name?: string | null
          emergency_contact_2_phone?: string | null
          emergency_contact_3_name?: string | null
          emergency_contact_3_phone?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          first_name?: string | null
          food_preference?: string | null
          gender?: string | null
          health_insurance_company?: string | null
          health_insurance_expiry?: string | null
          health_insurance_phone?: string | null
          health_insurance_policy_number?: string | null
          height_cm?: number | null
          id?: string
          last_name?: string | null
          life_insurance_company?: string | null
          life_insurance_expiry?: string | null
          life_insurance_phone?: string | null
          life_insurance_policy_number?: string | null
          medical_conditions?: string[] | null
          medication_window_minutes?: number
          mobile_country_code?: string | null
          mobile_number?: string | null
          nudge_interval_hours?: number
          pan_card_image_url?: string | null
          pan_number_encrypted?: string | null
          pan_number_iv?: string | null
          preferred_language?: string | null
          profile_completed_at?: string | null
          profile_pin_hash?: string | null
          profile_pin_salt?: string | null
          profile_reminder_count?: number | null
          profile_reminder_dismissed_at?: string | null
          updated_at?: string
          user_id: string
          weekly_report_enabled?: boolean
          weight_kg?: number | null
        }
        Update: {
          aadhaar_card_image_url?: string | null
          aadhaar_number_encrypted?: string | null
          aadhaar_number_iv?: string | null
          allergies?: string[] | null
          appointment_pre_alert_minutes?: number
          avatar_url?: string | null
          blood_type?: string | null
          car_insurance_company?: string | null
          car_insurance_expiry?: string | null
          car_insurance_phone?: string | null
          car_insurance_policy_number?: string | null
          created_at?: string
          date_of_birth?: string | null
          display_name?: string | null
          doctor_mobile?: string | null
          doctor_name?: string | null
          emergency_contact_2_name?: string | null
          emergency_contact_2_phone?: string | null
          emergency_contact_3_name?: string | null
          emergency_contact_3_phone?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          first_name?: string | null
          food_preference?: string | null
          gender?: string | null
          health_insurance_company?: string | null
          health_insurance_expiry?: string | null
          health_insurance_phone?: string | null
          health_insurance_policy_number?: string | null
          height_cm?: number | null
          id?: string
          last_name?: string | null
          life_insurance_company?: string | null
          life_insurance_expiry?: string | null
          life_insurance_phone?: string | null
          life_insurance_policy_number?: string | null
          medical_conditions?: string[] | null
          medication_window_minutes?: number
          mobile_country_code?: string | null
          mobile_number?: string | null
          nudge_interval_hours?: number
          pan_card_image_url?: string | null
          pan_number_encrypted?: string | null
          pan_number_iv?: string | null
          preferred_language?: string | null
          profile_completed_at?: string | null
          profile_pin_hash?: string | null
          profile_pin_salt?: string | null
          profile_reminder_count?: number | null
          profile_reminder_dismissed_at?: string | null
          updated_at?: string
          user_id?: string
          weekly_report_enabled?: boolean
          weight_kg?: number | null
        }
        Relationships: []
      }
      saved_locations: {
        Row: {
          address: string
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      teleconsultations: {
        Row: {
          created_at: string
          duration_seconds: number
          follow_up: string[]
          id: string
          recommendations: string[]
          recording_type: string
          summary: string
          symptoms: string[]
          transcript: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number
          follow_up?: string[]
          id?: string
          recommendations?: string[]
          recording_type: string
          summary: string
          symptoms?: string[]
          transcript: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number
          follow_up?: string[]
          id?: string
          recommendations?: string[]
          recording_type?: string
          summary?: string
          symptoms?: string[]
          transcript?: string
          user_id?: string
        }
        Relationships: []
      }
      user_activity: {
        Row: {
          created_at: string
          id: string
          last_active_at: string
          last_check_in_at: string | null
          last_phone_signal_at: string | null
          sos_response_count: number | null
          sos_started_at: string | null
          sos_status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_active_at?: string
          last_check_in_at?: string | null
          last_phone_signal_at?: string | null
          sos_response_count?: number | null
          sos_started_at?: string | null
          sos_status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_active_at?: string
          last_check_in_at?: string | null
          last_phone_signal_at?: string | null
          sos_response_count?: number | null
          sos_started_at?: string | null
          sos_status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vault_items: {
        Row: {
          category: string
          created_at: string
          encrypted_data: string
          encryption_iv: string
          id: string
          notes: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          encrypted_data: string
          encryption_iv: string
          id?: string
          notes?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          encrypted_data?: string
          encryption_iv?: string
          id?: string
          notes?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      video_call_rooms: {
        Row: {
          created_at: string
          ended_at: string | null
          host_user_id: string
          id: string
          room_code: string
          status: string
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          host_user_id: string
          id?: string
          room_code: string
          status?: string
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          host_user_id?: string
          id?: string
          room_code?: string
          status?: string
        }
        Relationships: []
      }
      video_call_signals: {
        Row: {
          created_at: string
          id: string
          room_code: string
          sender_id: string
          signal_data: Json
          signal_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          room_code: string
          sender_id: string
          signal_data: Json
          signal_type: string
        }
        Update: {
          created_at?: string
          id?: string
          room_code?: string
          sender_id?: string
          signal_data?: Json
          signal_type?: string
        }
        Relationships: []
      }
      vitals_scans: {
        Row: {
          created_at: string
          heart_rate: number | null
          heart_rate_confidence: number | null
          hrv_rmssd: number | null
          hrv_sdnn: number | null
          id: string
          respiratory_rate: number | null
          scan_mode: string
          user_id: string
        }
        Insert: {
          created_at?: string
          heart_rate?: number | null
          heart_rate_confidence?: number | null
          hrv_rmssd?: number | null
          hrv_sdnn?: number | null
          id?: string
          respiratory_rate?: number | null
          scan_mode?: string
          user_id: string
        }
        Update: {
          created_at?: string
          heart_rate?: number | null
          heart_rate_confidence?: number | null
          hrv_rmssd?: number | null
          hrv_sdnn?: number | null
          id?: string
          respiratory_rate?: number | null
          scan_mode?: string
          user_id?: string
        }
        Relationships: []
      }
      wellness_scores: {
        Row: {
          analysis: string | null
          bp_diastolic: number | null
          bp_systolic: number | null
          created_at: string
          diabetes_value: number | null
          diagnosis: string | null
          heart_rate: number | null
          hydration: number | null
          id: string
          overall_score: number
          recommendations: string[] | null
          respiratory_rate: number | null
          risk_level: string
          risk_summary: string | null
          spo2: number | null
          temperature: number | null
          user_id: string
        }
        Insert: {
          analysis?: string | null
          bp_diastolic?: number | null
          bp_systolic?: number | null
          created_at?: string
          diabetes_value?: number | null
          diagnosis?: string | null
          heart_rate?: number | null
          hydration?: number | null
          id?: string
          overall_score: number
          recommendations?: string[] | null
          respiratory_rate?: number | null
          risk_level?: string
          risk_summary?: string | null
          spo2?: number | null
          temperature?: number | null
          user_id: string
        }
        Update: {
          analysis?: string | null
          bp_diastolic?: number | null
          bp_systolic?: number | null
          created_at?: string
          diabetes_value?: number | null
          diagnosis?: string | null
          heart_rate?: number | null
          hydration?: number | null
          id?: string
          overall_score?: number
          recommendations?: string[] | null
          respiratory_rate?: number | null
          risk_level?: string
          risk_summary?: string | null
          spo2?: number | null
          temperature?: number | null
          user_id?: string
        }
        Relationships: []
      }
      wellness_sharing: {
        Row: {
          alert_on_low_score: boolean
          alert_threshold: number
          created_at: string
          guardian_id: string
          id: string
          is_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_on_low_score?: boolean
          alert_threshold?: number
          created_at?: string
          guardian_id: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_on_low_score?: boolean
          alert_threshold?: number
          created_at?: string
          guardian_id?: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wellness_sharing_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_plans: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          persona_snapshot: Json | null
          plan_data: Json
          plan_name: string
          source: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          persona_snapshot?: Json | null
          plan_data?: Json
          plan_name: string
          source?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          persona_snapshot?: Json | null
          plan_data?: Json
          plan_name?: string
          source?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_ai_rate_limits_and_cache: { Args: never; Returns: undefined }
      cleanup_expired_otps: { Args: never; Returns: undefined }
      cleanup_old_medication_logs: { Args: never; Returns: undefined }
      get_guardian_emergency_profile: {
        Args: { _user_id: string }
        Returns: {
          allergies: string[]
          avatar_url: string
          blood_type: string
          display_name: string
          doctor_mobile: string
          doctor_name: string
          emergency_contact_name: string
          emergency_contact_phone: string
          emergency_contact_relationship: string
          first_name: string
          last_name: string
          medical_conditions: string[]
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_guardian_of: {
        Args: { _guardian_user_id: string; _user_id: string }
        Returns: boolean
      }
      is_guardian_record_owner: {
        Args: { _guardian_id: string }
        Returns: boolean
      }
      update_expired_guardians: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      medical_document_type:
        | "lab_report"
        | "prescription"
        | "discharge_summary"
        | "imaging"
        | "vaccination"
        | "insurance"
        | "consultation_notes"
        | "surgical_report"
        | "pathology"
        | "other"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
      medical_document_type: [
        "lab_report",
        "prescription",
        "discharge_summary",
        "imaging",
        "vaccination",
        "insurance",
        "consultation_notes",
        "surgical_report",
        "pathology",
        "other",
      ],
    },
  },
} as const
