import { useState } from 'react';

export default function Ruleta({ onResultado }) {
  const [fichaSeleccionada, setFichaSeleccionada] = useState(null);
  const [apuesta, setApuesta] = useState(null);
  const [girando, setGirando] = useState(false);
  const [resultado, setResultado] = useState(null);

  const girarRuleta = async () => {
    if (!fichaSeleccionada || !apuesta) return alert("Debes elegir una ficha y un tipo de apuesta");

    setGirando(true);
    setResultado(null);

    try {
      const res = await fetch("http://localhost:3000/api/ruleta/jugar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ficha: fichaSeleccionada, apuesta })
      });

      const data = await res.json();

      setResultado(data);
      onResultado && onResultado(data);
    } catch (error) {
      console.error("Error al conectar con backend", error);
      alert("Error al jugar. Revisa el backend.");
    }

    setGirando(false);(data);
    onResultado && onResultado(data);
    setGirando(false);
  };

  return (
    <div className="p-4 text-white">
      <h1 className="text-3xl mb-4">Ruleta</h1>

      {/* Selección de ficha */}
      <div className="mb-4">
        <h2 className="text-xl">Selecciona una ficha:</h2>
        <div className="flex gap-3 mt-2">
          {[100, 500, 1000].map((valor) => (
            <button
              key={valor}
              onClick={() => setFichaSeleccionada(valor)}
              className={`px-4 py-2 rounded-xl border ${fichaSeleccionada === valor ? "bg-blue-600" : "bg-gray-700"}`}
            >
              ${valor}
            </button>
          ))}
        </div>
      </div>

      {/* Selección de apuesta */}
      <div className="mb-4">
        <h2 className="text-xl">Apuesta al número:</h2>
        <input
          type="number"
          min="0"
          max="36"
          value={apuesta || ""}
          onChange={(e) => setApuesta(Number(e.target.value))}
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
          <p>Número: {resultado.numero}</p>
          <p>Color: {resultado.color}</p>
          <p>{resultado.ganaste ? "Ganaste!" : "Perdiste"}</p>
        </div>
      )}
    </div>
  );
}
