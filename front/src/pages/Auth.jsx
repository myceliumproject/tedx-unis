export default function Auth() {
  return (
    <div className="p-3 text-center d-flex align-items-center justify-content-center align-self-center">
      <div className="border p-4 align-items-center">
        <h1 className="text-center">Iniciar Sesión</h1>
        <div className="form-floating mb-3">
          <input
            type="email"
            id="email"
            className="form-control rounded"
            placeholder="Correo electrónico"
          />
          <label for="email">Correo electrónico</label>
        </div>
        <div className="form-floating mb-3">
          <input
            className="form-control rounded"
            id="name"
            placeholder="Nombre"
          />
          <label for="name">Nombre</label>
        </div>
        <button
          type="button"
          className="btn btn-primary align-self-center rounded text-white"
        >
          Ingresar
        </button>
      </div>
    </div>
  );
}
