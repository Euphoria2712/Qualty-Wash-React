
export const isUserAdmin = (): boolean => {
  const token = localStorage.getItem('token');
  
  if (!token) return false;
  
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const decodedPayload = JSON.parse(atob(padded));
    
    
    return decodedPayload.role === 'ADMIN';
  } catch (error) {
    console.error('Error al verificar rol de administrador:', error);
    return false;
  }
};


export const getUserRole = (): string | null => {
  const token = localStorage.getItem('token');
  
  if (!token) return null;
  
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const decodedPayload = JSON.parse(atob(padded));
    return decodedPayload.role || null;
  } catch (error) {
    console.error('Error al obtener rol del usuario:', error);
    return null;
  }
};


export const getUserEmail = (): string | null => {
  const token = localStorage.getItem('token');
  
  if (!token) return null;
  
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const decodedPayload = JSON.parse(atob(padded));
    return decodedPayload.sub || null; 
  } catch (error) {
    console.error('Error al obtener email del usuario:', error);
    return null;
  }
};

export const getUserIdFromToken = (): number | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const decodedPayload = JSON.parse(atob(padded));
    const possible = decodedPayload.userId ?? decodedPayload.id ?? decodedPayload.uid;
    const num = typeof possible === 'string' ? Number(possible) : possible;
    return typeof num === 'number' && !Number.isNaN(num) ? num : null;
  } catch {
    return null;
  }
};
