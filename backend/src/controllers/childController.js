import { supabase } from '../config/supabase.js';

export const createChild = async (req, res) => {
  try {
    const { full_name, gender, birth_date } = req.body;

    const { data, error } = await supabase
      .from('children')
      .insert({
        full_name,
        gender,
        birth_date,
        user_id: req.user.id
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
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getChildren = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('children')
      .select('*')
      .eq('user_id', req.user.id);

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

export const deleteChild = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('children')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Data anak berhasil dihapus'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getChildById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('children')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        message: 'Data anak tidak ditemukan'
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

export const updateChild = async (req, res) => {
  try {
    const { id } = req.params;

    const { full_name, gender, birth_date } = req.body;

    const { data, error } = await supabase
      .from('children')
      .update({
        full_name,
        gender,
        birth_date
      })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Data anak berhasil diupdate',
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
