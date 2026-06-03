import { supabase } from "../config/supabase.js";

export const getDashboard = async (req, res, next) => {
  try {

    const userId = req.user.id;

    // TOTAL CHILDREN
    const { count: totalChildren, error: childError } =
      await supabase
        .from("children")
        .select("*", {
          count: "exact",
          head: true
        })
        .eq("user_id", userId);

    if (childError) throw childError;

    // LATEST PREDICTION
    const {
      data: latestPrediction,
      error: predictionError,
    } = await supabase
      .from("prediction_histories")
      .select(`
        *,
        children!inner (
          full_name,
          gender,
          user_id
        )
      `)
      .eq("children.user_id", userId)
      .order("created_at", {
        ascending: false
      })
      .limit(1)
      .single();

    if (
      predictionError &&
      predictionError.code !== "PGRST116"
    ) {
      throw predictionError;
    }

    // HISTORIES
    const {
      data: histories,
      error: historyError,
    } = await supabase
      .from("prediction_histories")
      .select(`
        *,
        children!inner (
          full_name,
          gender,
          user_id
        )
      `)
      .eq("children.user_id", userId)
      .order("created_at", {
        ascending: false
      })
      .limit(5);

    if (historyError) throw historyError;

    // CHART DATA
    const {
      data: charts,
      error: chartError,
    } = await supabase
      .from("prediction_histories")
      .select(`
        measurement_date,
        height,
        weight,
        prediction_result,
        children!inner (
          user_id
        )
      `)
      .eq("children.user_id", userId)
      .order("measurement_date", {
        ascending: true
      });

    if (chartError) throw chartError;

    // Statistik tambahan
    const normalCount =
      histories.filter(
        item =>
          item.prediction_result === "Normal"
      ).length;

    const stuntingCount =
      histories.filter(
        item =>
          item.prediction_result?.includes("Stunting")
      ).length;

    const giziBurukCount =
      histories.filter(
        item =>
          item.prediction_result?.includes("Gizi Buruk")
      ).length;

    return res.status(200).json({
      success: true,
      data: {
        totalChildren,
        totalPredictions: histories.length,
        normalCount,
        stuntingCount,
        giziBurukCount,
        latestPrediction,
        histories,
        charts,
      },
    });

  } catch (error) {

    next(error);

  }
};
