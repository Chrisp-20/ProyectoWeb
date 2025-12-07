// Ruleta.js adaptado al backend modular (POST /api/ruleta/apostar)
// Ahora soporta múltiples apuestas (arreglo), como tu backend lo exige.

import { useState } from 'react';

export default function Ruleta({ onResultado }) {
  const [fichaSeleccionada, setFichaSeleccionada] = useState(null);
  const [numeroSeleccionado, setNumeroSeleccionado] = useState(null);
  const [girando, setGirando] = useState(false);
  const [resultado, setResultado] = useState(null);

  // 🟢 Crear una apuesta válida para el backend
  const crearApuesta = () => {
    if (!fichaSeleccionada)
      return alert("Debes seleccionar una ficha");

    if (numeroSeleccionado === null || numeroSeleccionado === "")
      return alert("Debes seleccionar un número entre 0 y 36");

    return [
      {
        tipo: "numero",
        valor: numeroSeleccionado,
        monto: fichaSeleccionada
      }
    ];
  };

  const girarRuleta = async () => {
    const apuestas = crearApuesta();
    if (!apuestas) return;

    setGirando(true);
    setResultado(null);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/ruleta/apostar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ apuestas })
      });

      const data = await res.json();
      setResultado(data);
      onResultado && onResultado(data);
    } catch (error) {
      console.error("Error al conectar con backend", error);
      alert("Error al jugar. Revisa el backend.");
    }

    setGirando(false);
  };

  return (
    <div className="p-4 text-white">
      <h1 className="text-3xl mb-4">Ruleta</h1>

      {/* Selección de ficha */}
      <div className="mb-4">
        <h2 className="text-xl">Selecciona una ficha:</h2>
        <div className="flex gap-3 mt-2">
          {[1000, 5000, 10000, 50000, 100000].map((valor) => (
            <button
              key={valor}
              onClick={() => setFichaSeleccionada(valor)}
              className={`px-4 py-2 rounded-xl border ${fichaSeleccionada === valor ? "bg-blue-600" : "bg-gray-700"}`}
            >
              ${valor.toLocaleString("es-CL")} CLP
            </button>
          ))}
        </div>
      </div>

      {/* Selección de número */}
      <div className="mb-4">
        <h2 className="text-xl">Apuesta al número:</h2>
        <input
          type="number"
          min="0"
          max="36"
          value={numeroSeleccionado || ""}
          onChange={(e) => setNumeroSeleccionado(Number(e.target.value))}
          className="text-black p-2 rounded"
        />
      </div>

      {/* Botón girar */}
      <button
        onClick={girarRuleta}
        disabled={girando}
        className="px-5 py-3 bg-green-600 rounded-xl"
      >
        {girando ? "Girando..." : "Girar Ruleta"}
      </button>

      {/* Resultado */}
      {resultado && (
        <div className="mt-6 p-4 bg-gray-800 rounded-xl">
          <h3 className="text-xl">Resultado:</h3>

          {resultado.success ? (
            <>
              <p>Número: {resultado.resultado.numero}</p>
              <p>Color: {resultado.resultado.color}</p>
              <p>Ganancia Neta: {resultado.gananciaNeta}</p>
              <p>Saldo Actualizado: {resultado.saldo}</p>
            </>
          ) : (
            <p className="text-red-400">{resultado.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
