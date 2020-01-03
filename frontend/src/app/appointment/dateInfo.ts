import {View} from '@fullcalendar/core/View';
import {DateClickApi} from '@fullcalendar/core/Calendar';

export class DateInfo implements DateClickApi {
    date: Date;
    dateStr: string;
    allDay: boolean;
    dayEl: HTMLElement;
    jsEvent: UIEvent;
    view: View;

    constructor() {};
}
