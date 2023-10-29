class TrackingInformation {
    private _shippingCompany: string | undefined; // 배송 회사
    private _trackingNumber: string | undefined; // 추적 번호

    get shippingCompany() {
        return this._shippingCompany;
    }

    set shippingCompany(arg) {
        this._shippingCompany = arg;
    }

    get trackingNumber() {
        return this._trackingNumber;
    }

    set trackingNumber(arg) {
        this._trackingNumber = arg;
    }

    get display() {
        return `${this.shippingCompany}: ${this.trackingNumber}`;
    }
}

class Shipment {
    private _trackingInformation: TrackingInformation;

    constructor() {
        this._trackingInformation = new TrackingInformation();
    }

    get trackingInfo() {
        return this._trackingInformation.display;
    }

    get trackingInformation() {
        return this._trackingInformation;
    }

    set trackingInformation(aTrackingInformation) {
        this._trackingInformation = aTrackingInformation;
    }
}

const client1 = () => {
    const aShipment = new Shipment();
    const request: any = {vendor: 'A-SHIP', number: '010-1234-5678'};
    aShipment.trackingInformation.shippingCompany = request.vendor;
    aShipment.trackingInformation.trackingNumber = request.number;
    return aShipment.trackingInfo;
};

console.log(client1());
