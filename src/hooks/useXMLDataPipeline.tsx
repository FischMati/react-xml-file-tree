import { useState, useEffect, useMemo } from "react";
import parseXMLToTree from "../utils/parseXMLtoTree";
import transformTreeToJSON from "../utils/transformTreeToJSON";

const useXMLDataPipeline = (fetchUrl: string) => {
  const [xmlData, setXmlData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchXML = async () => {
      try {
        const response = await fetch(fetchUrl);
        const xmlText = await response.text();
        setXmlData(xmlText);
      } catch (err) {
        setError("Error fetching XML data");
      }
    };

    if (fetchUrl) {
      fetchXML();
    }
  }, [fetchUrl]);

  const result = useMemo(() => {
    if (xmlData) {
      try {
        const parsedTree = parseXMLToTree(xmlData);
        return transformTreeToJSON(parsedTree);
      } catch (err) {
        setError("Error processing XML data");
        return null;
      }
    }
    return null;
  }, [xmlData]); // Re-run parsing/conversion only when xmlData changes

  return { result, error };
};

export default useXMLDataPipeline;