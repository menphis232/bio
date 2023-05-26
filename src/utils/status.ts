export enum Status {
    IN_PROCESS = 1,
    CLOSE = 2,
    RECEIVED = 3,
    PROCESSED = 4,
    DETAINED = 5,
    DELETED = 6,
}

interface StatusNames {
    [idx: number]: string;
}

export const STATUS_NAMES: StatusNames = {
    1: 'Pendiente',
    2: 'Facturado',
    3: 'Enviado',
    4: 'Procesado',
    5: 'Retenido',
    6: 'Anulado',
}
