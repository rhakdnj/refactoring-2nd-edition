class Shipment {
    private _shippingCompany: string | undefined; // 배송 회사
    private _trackingNumber: string | undefined; // 추적 번호

    get trackingInfo() {
        return `${this._shippingCompany}: ${this._trackingNumber}`;
    }

    set shippingCompany(arg: string) {
        this._shippingCompany = arg;
    }

    set trackingNumber(arg: string) {
        this._trackingNumber = arg;
    }
}

const client1 = () => {
    const aShipment = new Shipment();
    const request: any = {vendor: 'A-SHIP', number: '010-1234-5678'};
    aShipment.shippingCompany = request.vendor;
    aShipment.trackingNumber = request.number;
    return aShipment.trackingInfo;
};

console.log(client1());
