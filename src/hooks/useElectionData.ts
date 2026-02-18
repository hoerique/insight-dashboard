import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { CityData } from "@/data/electionData";

interface SupabaseRow {
    NUM: number;
    CIDADE: string;
    NUM_ELEITORES: number;
    DEP_ESTADUAL_2018: number | null;
    DEP_ESTADUAL_2022: number | null;
    PROJECAO_2026_MAX: number | null;
    PROJECAO_2026_MED: number | null;
    PROJECAO_2026_MIN: number | null;
}

async function fetchElectionData(): Promise<CityData[]> {
    const { data, error } = await supabase
        .from("Meta Eleição")
        .select("*")
        .order("NUM", { ascending: true });

    if (error) throw error;

    return (data as SupabaseRow[]).map((row) => ({
        id: row.NUM,
        cidade: row.CIDADE,
        eleitores: row.NUM_ELEITORES,
        votos2018: row.DEP_ESTADUAL_2018,
        votos2022: row.DEP_ESTADUAL_2022,
        metaMax: row.PROJECAO_2026_MAX,
        metaMed: row.PROJECAO_2026_MED,
        metaMin: row.PROJECAO_2026_MIN,
    }));
}

export function useElectionData() {
    return useQuery<CityData[]>({
        queryKey: ["election-data"],
        queryFn: fetchElectionData,
        staleTime: 5 * 60 * 1000, // 5 min cache
    });
}
