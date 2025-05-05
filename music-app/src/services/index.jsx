import axios from 'axios';

// Hook personnalisé pour les appels API
const useFetch = () => {
    const fetchData = async (url, method = 'GET', data = {}, headers = {}) => {
        try {
        const token = localStorage.getItem('token');
        const baseUrl = "http://localhost:5000/api/zikema";
        url = baseUrl + url;

        console.log(url);
        // Ajout de l'Authorization si le token existe
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Déterminer le Content-Type automatiquement si non fourni
        if (!headers['Content-Type']) {
            headers['Content-Type'] = data instanceof FormData
            ? 'multipart/form-data'
            : 'application/json';
        }

        const config = { headers };

        // Convertir en JSON si ce n'est pas un FormData
        if (
            headers['Content-Type'] === 'application/json' &&
            typeof data === 'object' &&
            !(data instanceof FormData)
        ) {
            data = JSON.stringify(data);
        }

        let response;

        switch (method.toUpperCase()) {
            case 'GET':
                response = await axios.get(url, config);
                break;
            case 'POST':
                response = await axios.post(url, data, config);
                break;
            case 'PUT':
                response = await axios.put(url, data, config);
                break;
            case 'PATCH':
                response = await axios.patch(url, data, config);
                break;
            case 'DELETE':
                response = await axios.delete(url, config);
                break;
            default:
            throw new Error(`Unsupported HTTP method: ${method}`);
        }

        return { data: response.data, error: null };

        } catch (error) {
            console.error('[API Error]', error);
            return { data: null, error: error.response };
        }
    };

    return fetchData;
};

export default useFetch;
