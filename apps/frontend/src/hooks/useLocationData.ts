import { fetchapi } from '@/lib/refresh-user';
import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/api';

export const useLocationData = (country?: string, state?: string, district?: string, taluka?: string) => {
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [talukas, setTalukas] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);
  const [loading, setLoading] = useState({
    states: false,
    districts: false,
    talukas: false,
    villages: false,
  });

  useEffect(() => {
    if (!country || country !== "India") {
      setStates([]);
      setDistricts([]);
      setTalukas([]);
      setVillages([]);
      return;
    }
    const fetchStates = async () => {
      setLoading(prev => ({ ...prev, states: true }));
      try {
        console.log("fetching states...");
        const response = await fetchapi(`${API_BASE_URL}/location/states`, {
          method: "GET",
        });
        console.log("fetched states response", response);
        const json = await response.json();
        if (json.success) setStates(json.data);
      } catch (error) {
        console.error('Error fetching states', error);
      } finally {
        setLoading(prev => ({ ...prev, states: false }));
      }
    };
    fetchStates();
  }, [country]);

  useEffect(() => {
    if (!state) {
      setDistricts([]);
      setTalukas([]);
      setVillages([]);
      return;
    }
    const fetchDistricts = async () => {
      setLoading(prev => ({ ...prev, districts: true }));
      try {
        const response = await fetchapi(`${API_BASE_URL}/location/districts?state=${state}`, {
          method: "GET"
        });
        const json = await response.json();
        if (json.success) setDistricts(json.data);
      } catch (error) {
        console.error('Error fetching districts', error);
      } finally {
        setLoading(prev => ({ ...prev, districts: false }));
      }
    };
    fetchDistricts();
  }, [state]);

  useEffect(() => {
    if (!district) {
      setTalukas([]);
      setVillages([]);
      return;
    }
    const fetchTalukas = async () => {
      setLoading(prev => ({ ...prev, talukas: true }));
      try {
        const response = await fetchapi(`${API_BASE_URL}/location/talukas?district=${district}`, {
          method: "GET"
        });
        const json = await response.json();
        if (json.success) setTalukas(json.data);
      } catch (error) {
        console.error('Error fetching talukas', error);
      } finally {
        setLoading(prev => ({ ...prev, talukas: false }));
      }
    };
    fetchTalukas();
  }, [district]);

  useEffect(() => {
    if (!taluka) {
      setVillages([]);
      return;
    }
    const fetchVillages = async () => {
      setLoading(prev => ({ ...prev, villages: true }));
      try {
        const response = await fetchapi(`${API_BASE_URL}/location/villages?taluka=${taluka}`, {
          method: "GET"
        });
        const json = await response.json();
        if (json.success) setVillages(json.data);
      } catch (error) {
        console.error('Error fetching villages', error);
      } finally {
        setLoading(prev => ({ ...prev, villages: false }));
      }
    };
    fetchVillages();
  }, [taluka]);

  return { states, districts, talukas, villages, loading };
};
