function calcularDisponible(ingresos, egresos) {
    var resultado = ingresos - egresos;

    if (resultado < 0) {
        return 0;
    }

    return resultado;
}

function calcularCapacidadPago(montoDisponible) {
    return montoDisponible * 0.50;
}

function calcularInteresSimple(monto, tasa, plazoAnios) {
    return plazoAnios * monto * (tasa / 100);
}

function calcularTotalPagar(monto, interes) {
    return monto + interes + 100;
}

function calcularCuotaMensual(total, plazoAnios) {
    var meses = plazoAnios * 12;
    return total / meses;
}

function aprobarCredito(capacidadPago, cuotaMensual) {
    if (capacidadPago > cuotaMensual) {
        return true;
    } else {
        return false;
    }
}