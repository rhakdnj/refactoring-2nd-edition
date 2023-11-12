const score = (candidate: any, medicalExam: any, scoringGuide: any) => {
    return new Score(candidate, medicalExam, scoringGuide).execute();
};

class Score {
    private _result: number;
    private _healthLevel: number;
    private _highMedicalRiskFlag: boolean;

    constructor(
        private readonly _candidate: any,
        private readonly _medicalExam: any,
        private readonly _scoringGuide: any
    ) {
        this._result = 0;
        this._healthLevel = 0;
        this._highMedicalRiskFlag = false;
    }

    execute() {
        this._result = 0;
        this._healthLevel = 0;
        this._highMedicalRiskFlag = false;

        this.scoreSmoking();
        const certificationGrade = this.certificationGrade()
        this._result -= Math.max(this._healthLevel - 5, 0);

        return {
            result: this._result,
            certificationGrade,
            _highMedicalRiskFlag: this._highMedicalRiskFlag
        };
    }

    private certificationGrade() {
        let certificationGrade = 'regular';
        if (scoringGuide.stateWithLowCertification(this._candidate.originState)) {
            certificationGrade = 'low';
            this._result -= 5;
        }
        return certificationGrade;
    }

    private scoreSmoking() {
        if (this._medicalExam.isSmoker) {
            this._healthLevel += 10;
            this._highMedicalRiskFlag = true;
        }
    }
}


const scoringGuide = {
    stateWithLowCertification: (state: string) => state === 'CA' || state === 'ME'
};
console.log(score({originState: 'CA'}, {isSmoker: true}, scoringGuide));
console.log(score({originState: 'NY'}, {isSmoker: false}, scoringGuide));
