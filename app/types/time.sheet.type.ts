interface TimeSheet {
    sheet_id: number;
    sheet_state: string;
    sheet_hours: number;
    sheet_total_payed: number;
    sheet_pay_rate: number;
    sheet_check_date: number;
    employee: {
        employee_name: string;
        employee_lastname: string;
        employee_pay_type: string;
    }
}

export default TimeSheet;