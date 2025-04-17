export default {
    parameters: ({country, restaurantId, orderMode}) => ['getcurrenttime', country, restaurantId, orderMode],
    response: {
        time: {
            _self: 'st',
            currentTime: '*ct',
            weekday: 'wd',
            open: '!rs'
        }
    }
};
