const CLIENT_ID = process.env.REACT_APP_COGNITO_CLIENT_ID;
const COGNITO_DOMAIN = process.env.REACT_APP_COGNITO_DOMAIN;
const REDIRECT_URI = process.env.REACT_APP_COGNITO_REDIRECT_URI;

export const login = () => {
  const loginUrl = `https://${COGNITO_DOMAIN}/login?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  window.location.href = loginUrl;
};

export const logout = () => {
  const logoutUrl = `https://${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(REDIRECT_URI)}`;
  localStorage.removeItem('id_token');
  localStorage.removeItem('access_token');
  window.location.href = logoutUrl;
};

export const handleRedirect = async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  if (code) {
    try {
      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        code: code,
        redirect_uri: REDIRECT_URI
      });

      const res = await fetch(`https://${COGNITO_DOMAIN}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
      });

      const data = await res.json();

      if (data.id_token) {
        localStorage.setItem('id_token', data.id_token);
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
        }

        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return true;
      } else {
        console.error('No id_token found in response:', data);
        return false;
      }
    } catch (err) {
      console.error('Failed to exchange code for token', err);
      return false;
    }
  }
  return false;
};

export const isAuthenticated = () => !!localStorage.getItem('id_token');

export const getUserGroups = () => {
  const token = localStorage.getItem('id_token');
  if (!token) return [];
  try {
    // JWTs are [Header].[Payload].[Signature]
    const payload = token.split('.')[1]; 
    const decoded = JSON.parse(atob(payload));
    return decoded['cognito:groups'] || [];
  } catch (e) {
    return [];
  }
};

export const isAdmin = () => getUserGroups().includes('admin');

export const getUserName = () => {
  const token = localStorage.getItem('id_token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Cognito usually stores it in 'given_name' or 'name' 
    // depending on your User Pool settings
    return payload.given_name || payload.name || payload.email;
  } catch (e) {
    return null;
  }
};