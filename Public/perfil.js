// ============================================
// CARGA DE DATOS DEL PERFIL
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  // Proteger la ruta
  if (!protegerRuta()) {
    return;
  }

  // Cargar datos del perfil
  await cargarDatosPerfil();
});

async function cargarDatosPerfil() {
  try {
    // Obtener perfil del usuario
    const perfil = await obtenerPerfil();
    
    if (!perfil) {
      mostrarError('Error al cargar perfil');
      return;
    }

    // Actualizar información básica
    document.querySelector('h1').textContent = `Bienvenido, ${perfil.nombre}`;
    
    const infoList = document.querySelector('.profile-info ul');
    if (infoList) {
      const fechaMiembro = perfil.createdAt 
        ? new Date(perfil.createdAt).toLocaleDateString('es-CL')
        : 'N/A';
      
      infoList.innerHTML = `
        <li>Nombre: <strong>${perfil.nombre}</strong></li>
        <li>Email: <strong>${perfil.correo}</strong></li>
        <li>Saldo Disponible: <strong>${perfil.saldo.toLocaleString('es-CL')}</strong></li>
        <li>Miembro desde: <strong>${fechaMiembro}</strong></li>
      `;
    }

    // Cargar historial
    const historial = await obtenerHistorial();
    
    if (historial && historial.length > 0) {
      // Separar transacciones monetarias (depósito/retiro) de apuestas
      const transacciones = historial.filter(h => h.tipo === 'deposito' || h.tipo === 'retiro');
      const apuestas = historial.filter(h => h.tipo === 'apuesta' || h.tipo === 'ganancia');
      
      // Actualizar tabla de transacciones
      actualizarTablaTransacciones(transacciones);
      
      // Actualizar tabla de apuestas
      actualizarTablaApuestas(apuestas);
    }

  } catch (error) {
    console.error('Error cargando perfil:', error);
    mostrarError('Error al cargar datos del perfil');
  }
}

function actualizarTablaTransacciones(transacciones) {
  const tbody = document.querySelector('.tabla-transacciones tbody');
  
  if (!tbody) return;
  
  if (transacciones.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3">No hay transacciones monetarias registradas aún.</td></tr>';
    return;
  }

  tbody.innerHTML = transacciones.slice(0, 5).map(t => {
    const fecha = new Date(t.fecha).toLocaleString('es-CL');
    const positivo = t.tipo === 'deposito';
    const signo = positivo ? '+' : '-';
    const color = positivo ? 'var(--color-success)' : 'var(--color-danger)';
    
    return `
      <tr>
        <td>${fecha}</td>
        <td>${t.descripcion || t.tipo}</td>
        <td style="color: ${color};">
          ${signo} $${t.monto.toLocaleString('es-CL')}
        </td>
      </tr>
    `;
  }).join('');
}

function actualizarTablaApuestas(apuestas) {
  const tbody = document.querySelectorAll('.tabla-transacciones tbody')[1];
  
  if (!tbody) return;
  
  if (apuestas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3">No hay apuestas registradas aún.</td></tr>';
    return;
  }

  tbody.innerHTML = apuestas.slice(0, 5).map(a => {
    const fecha = new Date(a.fecha).toLocaleString('es-CL');
    const positivo = a.tipo === 'ganancia';
    const signo = positivo ? '+' : '-';
    const color = positivo ? 'var(--color-success)' : 'var(--color-danger)';
    
    // Limpiar descripción (quitar el prefijo "Ruleta - ")
    let descripcion = a.descripcion || a.tipo;
    if (descripcion.startsWith('Ruleta - ')) {
      descripcion = descripcion.substring(9);
      // Acortar si es muy largo
      if (descripcion.length > 50) {
        descripcion = descripcion.substring(0, 47) + '...';
      }
    }
    
    return `
      <tr>
        <td>${fecha}</td>
        <td>${descripcion}</td>
        <td style="color: ${color};">
          ${signo} $${a.monto.toLocaleString('es-CL')}
        </td>
      </tr>
    `;
  }).join('');
}