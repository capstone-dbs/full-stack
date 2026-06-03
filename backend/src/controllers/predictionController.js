import { supabase } from '../config/supabase.js';

import { predictGrowth } from '../services/aiService.js';

export const createPrediction = async (req, res) => {
  try {

    const {
      child_id,
      weight,
      height,
      measurement_date
    } = req.body;

    // ambil data anak berdasarkan user login
    const { data: child, error: childError } = await supabase
      .from('children')
      .select('*')
      .eq('id', child_id)
      .eq('user_id', req.user.id)
      .single();

    if (childError || !child) {
      return res.status(404).json({
        success: false,
        message: 'Anak tidak ditemukan'
      });
    }

    // hitung umur dalam bulan
    const birthDate = new Date(child.birth_date);

    const measureDate = new Date(measurement_date);

    let ageMonths =
      (measureDate.getFullYear() - birthDate.getFullYear()) * 12 +
      (measureDate.getMonth() - birthDate.getMonth());

    if (measureDate.getDate() < birthDate.getDate()) {
      ageMonths -= 1;
    }

      
    if (ageMonths < 0 || ageMonths > 60) {
      return res.status(400).json({
        success: false,
        message: "Usia anak harus antara 0-60 bulan"
      });
    }

    // kirim data ke FastAPI AI
    const prediction = await predictGrowth({
      age_months: ageMonths,
      weight_kg: weight,
      height_cm: height
    });

    // simpan ke database
    const { data, error } = await supabase
      .from('prediction_histories')
      .insert({
        child_id,
        weight,
        height,
        measurement_date,
        age_months: ageMonths,
        prediction_result: prediction.prediction_label
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(201).json({
      success: true,
      prediction: prediction.prediction_label,
      probability: prediction.probability,
      bmi: prediction.calculated_bmi,
      risks: prediction.risks,
      input_data: prediction.input_data,
      rekomendasi: prediction.recommendation,
      food_recommendations: prediction.food_recommendations,
      raw_ai_response: prediction.raw_ai_response,
      data
    });

  } catch (error) {
    console.error("CREATE PREDICTION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// Mendapatkan semua riwayat prediksi untuk anak tertentu
export const getPredictionHistories = async (req, res) => {
  try {

    const { data, error } = await supabase
      .from('prediction_histories')
      .select(`
        *,
        children!inner (
          full_name,
          gender,
          user_id
        )
      `)
      .eq('children.user_id', req.user.id)
      .order('created_at', {
        ascending: false
      });

    if (error) {

      return res.status(400).json({
        success: false,
        message: error.message
      });

    }

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// Tambahan: Mendapatkan riwayat prediksi berdasarkan ID riwayat
export const getPredictionById = async (req, res) => {
  try {

    const { id } = req.params;

    const { data, error } = await supabase
      .from('prediction_histories')
      .select(`
        *,
        children!inner (
          full_name,
          gender,
          user_id
        )
      `)
      .eq('id', id)
      .eq('children.user_id', req.user.id)
      .single();

    if (error || !data) {

      return res.status(404).json({
        success: false,
        message: 'Riwayat tidak ditemukan'
      });

    }

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// Tambahan: Menghapus riwayat prediksi berdasarkan ID
export const deletePrediction = async (req, res) => {
  try {

    const { id } = req.params;

    // cek ownership history
    const { data: history, error: historyError } = await supabase
      .from('prediction_histories')
      .select(`
        *,
        children!inner (
          user_id
        )
      `)
      .eq('id', id)
      .eq('children.user_id', req.user.id)
      .single();

    if (historyError || !history) {

      return res.status(404).json({
        success: false,
        message: 'Riwayat tidak ditemukan'
      });

    }

    // hapus history
    const { error } = await supabase
      .from('prediction_histories')
      .delete()
      .eq('id', id);

    if (error) {

      return res.status(400).json({
        success: false,
        message: error.message
      });

    }

    return res.status(200).json({
      success: true,
      message: 'Riwayat berhasil dihapus'
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
