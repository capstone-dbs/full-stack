import axios from 'axios';

const AI_BASE_URL = process.env.AI_BASE_URL || 'http://127.0.0.1:8000';

const formatPercent = (value) => `${(Number(value || 0) * 100).toFixed(1)}%`;

const buildPredictionLabel = (risks) => {
  const positiveTargets = Object.entries(risks || {})
    .filter(([, value]) => value?.prediction)
    .map(([key]) => key);

  if (positiveTargets.length === 0) {
    return 'Normal';
  }

  const labels = positiveTargets.map((target) => {
    if (target === 'stunting') return 'Stunting';
    if (target === 'gizi_buruk') return 'Gizi Buruk';
    return target.replaceAll('_', ' ');
  });

  return `Risiko ${labels.join(' dan ')}`;
};

const foodRecommendationsByAge = [
  {
    min: 6,
    max: 8,
    title: 'Rekomendasi makanan usia 6-8 bulan',
    items: [
      'Bubur Singkong Isi Ikan dan Ayam dengan Saus Jeruk',
      'Bubur Soto Ayam Santan',
      'Bubur Sup Telur Daging Kacang Merah',
      'Bubur Kanji Rumbi Ayam dan Udang',
      'Puding Kentang Ayam dan Telur'
    ]
  },
  {
    min: 9,
    max: 11,
    title: 'Rekomendasi MPASI usia 9-11 bulan',
    items: [
      'Nasi Tim Ikan Tuna Telur Puyuh',
      'Nasi Tim Ayam Lele Cincang',
      'Nasi Tim Ikan Telur Sayuran',
      'Tim Bubur Manado Daging dan Udang',
      'Mie Kukus Telur Puyuh'
    ]
  },
  {
    min: 12,
    max: 23,
    title: 'Rekomendasi makanan usia 12-23 bulan',
    items: [
      'Nasi Sup Telur Puyuh Bola Tahu Ayam',
      'Nasi Soto Ayam Kuah Kuning',
      'Sup Telur Puyuh Ikan Air Tawar Labu Kuning',
      'Nasi Ikan Kuah Kuning',
      'Nugget Tempe Ayam Sayuran'
    ]
  },
  {
    min: 24,
    max: 59,
    title: 'Rekomendasi makanan usia 24-59 bulan',
    items: [
      'Nasi Ikan Lele Katsu Ceria',
      'Nasi Bakar Ayam Santan',
      'Nasi Masak Ayam Kecap Sayur',
      'Nasi Sup Tabas Udang Sayur',
      'Bola-bola Nasi Isi Rabuk Ikan'
    ]
  }
];

const getFoodRecommendations = (ageMonths, predictionLabel) => {
  const hasRisk = predictionLabel !== 'Normal';
  if (!hasRisk) {
    return {
      title: 'Rekomendasi umum',
      items: [
        'Pertahankan pola makan bergizi seimbang sesuai usia.',
        'Pantau berat dan tinggi badan secara rutin.',
        'Lakukan kontrol berkala ke posyandu atau tenaga kesehatan.'
      ],
      note: 'Menu khusus ditampilkan jika terdeteksi risiko stunting atau gizi buruk.'
    };
  }

  const group = foodRecommendationsByAge.find(
    (item) => ageMonths >= item.min && ageMonths <= item.max
  );

  if (!group) {
    return {
      title: 'Rekomendasi tindak lanjut',
      items: [
        'Konsultasikan hasil skrining dengan tenaga kesehatan.',
        'Pastikan asupan protein hewani, energi, dan mikronutrien sesuai usia.',
        'Pantau pertumbuhan secara berkala.'
      ],
      note: 'Daftar menu spesifik tersedia untuk usia 6-59 bulan.'
    };
  }

  return {
    title: group.title,
    items: group.items,
    note: 'Menu ini ditampilkan sebagai inspirasi makanan padat gizi untuk anak dengan risiko stunting atau gizi buruk.'
  };
};

const buildRecommendation = (predictionLabel, risks) => {
  const stunting = risks?.stunting;
  const giziBuruk = risks?.gizi_buruk;

  if (predictionLabel === 'Normal') {
    return 'Pertahankan pola makan bergizi seimbang, pantau pertumbuhan secara rutin, dan tetap lakukan kontrol berkala ke posyandu atau tenaga kesehatan.';
  }

  const notes = [];

  if (stunting?.prediction) {
    notes.push(`Risiko stunting terdeteksi (${formatPercent(stunting.probability)}). Pantau tinggi badan menurut umur dan konsultasikan ke tenaga kesehatan.`);
  }

  if (giziBuruk?.prediction) {
    notes.push(`Risiko gizi buruk terdeteksi (${formatPercent(giziBuruk.probability)}). Segera lakukan pemeriksaan lanjutan, idealnya dengan BB/TB atau BB/PB z-score, MUAC, dan pemeriksaan klinis.`);
  }

  return notes.join(' ');
};

export const predictGrowth = async (payload) => {
  try {
    const response = await axios.post(
      `${AI_BASE_URL}/predict`,
      {
        age_months: payload.age_months,
        weight_kg: payload.weight_kg,
        height_cm: payload.height_cm
      },
      {
        timeout: 30000
      }
    );

    const aiResult = response.data;
    const risks = aiResult.risks || {};
    const predictionLabel = buildPredictionLabel(risks);
    const riskProbabilities = Object.values(risks).map((risk) => Number(risk.probability || 0));
    const probability = riskProbabilities.length > 0 ? Math.max(...riskProbabilities) : 0;

    return {
      prediction_label: predictionLabel,
      probability,
      calculated_bmi: aiResult.calculated_features?.bmi,
      risks,
      input_data: aiResult.input_data,
      food_recommendations: getFoodRecommendations(payload.age_months, predictionLabel),
      recommendation: buildRecommendation(predictionLabel, risks),
      raw_ai_response: aiResult
    };
  } catch (error) {
    const detail = error.response?.data?.detail || error.message;
    throw new Error(`Gagal menghubungi model AI di ${AI_BASE_URL}: ${detail}`);
  }
};
