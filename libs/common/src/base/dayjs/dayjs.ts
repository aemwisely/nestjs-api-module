import * as dayjs from 'dayjs';
import 'dayjs/locale/th';
import * as buddhistEra from 'dayjs/plugin/buddhistEra';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as isBetween from 'dayjs/plugin/isBetween';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(timezone);
dayjs.extend(buddhistEra);
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export default dayjs;
