// Historial de crédito
let historialCreditos = [];

// Parámetro: monto máximo
let montoMaximo = 100000;

function mostrarError(idWrap, idError, mensaje) {
    document.getElementById(idError).innerText = mensaje;
    document.getElementById(idError).classList.add("mostrar-error");
    document.getElementById(idWrap).classList.add("borde-error");
}

function limpiarErrores() {
    document.querySelectorAll(".error-msg").forEach(el => {
        el.innerText = "";
        el.classList.remove("mostrar-error");
    });
    document.querySelectorAll(".input-wrap").forEach(el => {
        el.classList.remove("borde-error");
    });
}

//  CÁLCULO PRINCIPAL
function calcular() {
    limpiarErrores();
    var esValido = true;

    var txtIngresos     = document.getElementById("txtIngresos").value.trim();
    var txtArriendo     = document.getElementById("txtArriendo").value.trim();
    var txtAlimentacion = document.getElementById("txtAlimentacion").value.trim();
    var txtVarios       = document.getElementById("txtVarios").value.trim();
    var txtMonto        = document.getElementById("txtMonto").value.trim();
    var txtPlazo        = document.getElementById("txtPlazo").value.trim();
    var txtTasaInteres  = document.getElementById("txtTasaInteres").value.trim();

    // Leer teléfono del cliente
    var txtTelefono = document.getElementById("txtTelefono").value.trim();

    // Validaciones Situación Financiera
    var ingresos = parseFloat(txtIngresos);
    if (txtIngresos === "") {
        mostrarError("wrapIngresos", "errIngresos", "Los ingresos son obligatorios.");
        esValido = false;
    } else if (ingresos <= 0) {
        mostrarError("wrapIngresos", "errIngresos", "Los ingresos deben ser mayores a 0.");
        esValido = false;
    }

    var arriendo = txtArriendo === "" ? 0 : parseFloat(txtArriendo);
    if (arriendo < 0) { mostrarError("wrapArriendo", "errArriendo", "No se permiten valores negativos."); esValido = false; }

    var alimentacion = txtAlimentacion === "" ? 0 : parseFloat(txtAlimentacion);
    if (alimentacion < 0) { mostrarError("wrapAlimentacion", "errAlimentacion", "No se permiten valores negativos."); esValido = false; }

    var varios = txtVarios === "" ? 0 : parseFloat(txtVarios);
    if (varios < 0) { mostrarError("wrapVarios", "errVarios", "No se permiten valores negativos."); esValido = false; }

    // Validar teléfono
    if (txtTelefono === "") {
        mostrarError("wrapTelefono", "errTelefono", "El teléfono es obligatorio.");
        esValido = false;
    }

    // Validaciones Crédito
    var monto = parseFloat(txtMonto);
    if (txtMonto === "") {
        mostrarError("wrapMonto", "errMonto", "El monto es obligatorio.");
        esValido = false;
    } else if (monto < 100) {
        mostrarError("wrapMonto", "errMonto", "El monto mínimo es $100.");
        esValido = false;
    } else if (monto > montoMaximo) {
        // Validar contra montoMaximo configurado
        mostrarError("wrapMonto", "errMonto", "El monto supera el máximo permitido de $" + montoMaximo.toFixed(2) + ". Se limpia el campo.");
        document.getElementById("txtMonto").value = "";
        esValido = false;
    }

    var plazo = parseInt(txtPlazo);
    if (txtPlazo === "") {
        mostrarError("wrapPlazo", "errPlazo", "El plazo es obligatorio.");
        esValido = false;
    } else if (plazo < 1 || plazo > 30) {
        mostrarError("wrapPlazo", "errPlazo", "El plazo debe ser entre 1 y 30 años.");
        esValido = false;
    }

    var tasa = parseFloat(txtTasaInteres);
    if (txtTasaInteres === "") {
        mostrarError("wrapTasa", "errTasa", "La tasa de interés es obligatoria.");
        esValido = false;
    } else if (tasa <= 0 || tasa > 50) {
        mostrarError("wrapTasa", "errTasa", "La tasa debe ser mayor a 0% y máximo 50%.");
        esValido = false;
    }

    if (!esValido) return;

    // Cálculo
    var totalEgresos  = arriendo + alimentacion + varios;
    var disponible    = calcularDisponible(ingresos, totalEgresos);
    var capacidadPago = calcularCapacidadPago(disponible);
    var interes       = calcularInteresSimple(monto, tasa, plazo);
    var totalPagar    = calcularTotalPagar(monto, interes);
    var cuotaMensual  = calcularCuotaMensual(totalPagar, plazo);
    var aprobado      = aprobarCredito(capacidadPago, cuotaMensual);

    document.getElementById("spnTotalEgresos").textContent  = "USD " + totalEgresos.toFixed(2);
    document.getElementById("spnDisponible").textContent    = "USD " + disponible.toFixed(2);
    document.getElementById("spnCapacidadPago").textContent = "USD " + capacidadPago.toFixed(2);
    document.getElementById("spnInteresPagar").textContent  = "USD " + interes.toFixed(2);
    document.getElementById("spnTotalPrestamo").textContent = "USD " + totalPagar.toFixed(2);
    document.getElementById("spnCuotaMensual").textContent  = "USD " + cuotaMensual.toFixed(2);

    var estadoEl = document.getElementById("spnEstadoCredito");
    if (aprobado) {
        estadoEl.textContent = "✅ CRÉDITO APROBADO";
        estadoEl.style.color = "#27ae60";
    } else {
        estadoEl.textContent = "❌ CRÉDITO RECHAZADO";
        estadoEl.style.color = "#e74c3c";
    }

    // Guardar en historial
    historialCreditos.push({
        telefono      : txtTelefono,
        monto         : monto,
        plazo         : plazo,
        tasa          : tasa,
        cuotaMensual  : cuotaMensual,
        totalPagar    : totalPagar,
        estado        : aprobado ? "APROBADO" : "RECHAZADO"
    });
}

//  REINICIAR
function reiniciar() {
    limpiarErrores();
    ["txtIngresos","txtArriendo","txtAlimentacion","txtVarios",
     "txtMonto","txtPlazo","txtTasaInteres","txtTelefono"].forEach(function(id) {
        document.getElementById(id).value = "";
    });
    ["spnTotalEgresos","spnDisponible","spnCapacidadPago",
     "spnInteresPagar","spnTotalPrestamo","spnCuotaMensual"].forEach(function(id) {
        document.getElementById(id).textContent = "—";
    });
    var estadoEl = document.getElementById("spnEstadoCredito");
    estadoEl.textContent = "ANALIZANDO...";
    estadoEl.style.color = "#8a96a8";

    // Ocultar tablas si están visibles
    ocultarTablaVIP();
}

// PARÁMETRO MONTO MÁXIMO
function guardarMontoMaximo() {
    var val = parseFloat(document.getElementById("txtMontoMaximo").value.trim());
    var errEl = document.getElementById("errMontoMaximo");
    errEl.textContent = "";
    if (isNaN(val) || val < 100) {
        errEl.textContent = "Ingresa un monto máximo válido (mínimo $100).";
        return;
    }
    montoMaximo = val;
    errEl.style.color = "#27ae60";
    errEl.textContent = "✅ Monto máximo actualizado a $" + montoMaximo.toFixed(2);
}

//  CRÉDITOS VIP
function mostrarCreditosVIP() {
    var contenedor = document.getElementById("tablaVIP");
    var vip = historialCreditos.filter(function(c) { return c.monto > 5000; });

    if (vip.length === 0) {
        contenedor.innerHTML = "<p style='color:#8a96a8;margin-top:12px'>No hay créditos VIP (monto > $5000) registrados aún.</p>";
        contenedor.style.display = "block";
        return;
    }

    var html = "<h3 style='font-family:Playfair Display,serif;color:#c9a84c;margin-bottom:12px'>💎 Créditos VIP (Monto > $5,000)</h3>";
    html += "<div style='overflow-x:auto'><table class='vip-table'>";
    html += "<thead><tr><th>Teléfono</th><th>Monto</th><th>Plazo</th><th>Tasa</th><th>Cuota Mensual</th><th>Total a Pagar</th><th>Estado</th></tr></thead><tbody>";

    vip.forEach(function(c) {
        var color = c.estado === "APROBADO" ? "#1a7a4a" : "#c0392b";
        html += "<tr>";
        html += "<td>" + c.telefono + "</td>";
        html += "<td>$" + c.monto.toFixed(2) + "</td>";
        html += "<td>" + c.plazo + " año(s)</td>";
        html += "<td>" + c.tasa + "%</td>";
        html += "<td>$" + c.cuotaMensual.toFixed(2) + "</td>";
        html += "<td>$" + c.totalPagar.toFixed(2) + "</td>";
        html += "<td style='color:" + color + ";font-weight:700'>" + c.estado + "</td>";
        html += "</tr>";
    });
    html += "</tbody></table></div>";

    contenedor.innerHTML = html;
    contenedor.style.display = "block";
}

function ocultarTablaVIP() {
    var el = document.getElementById("tablaVIP");
    if (el) { el.style.display = "none"; el.innerHTML = ""; }
}

// MODAL "ACERCA DE"
function abrirAcercaDe() {
    document.getElementById("modalAcercaDe").style.display = "flex";
}

function cerrarAcercaDe() {
    document.getElementById("modalAcercaDe").style.display = "none";
}

//  INIT
window.onload = function () {
    document.getElementById("btnCalcularCredito").onclick = calcular;
    document.getElementById("btnReiniciar").onclick = reiniciar;

    document.getElementById("btnGuardarParam").onclick = guardarMontoMaximo;

    document.getElementById("btnCreditosVIP").onclick = mostrarCreditosVIP;

    document.getElementById("btnAcercaDe").onclick = abrirAcercaDe;
    document.getElementById("btnCerrarModal").onclick = cerrarAcercaDe;

    // Cerrar modal al hacer click fuera
    document.getElementById("modalAcercaDe").onclick = function(e) {
        if (e.target === this) cerrarAcercaDe();
    };
};
