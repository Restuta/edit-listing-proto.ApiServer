module.exports = [{
    id: 1,
    primaryPhoneNumber: {
        type: 0,
        countryCode: 0,
        number: 4259999610,
        extension: null,
        areaCode: null,
        isPrimary: true,
        formattedNumber: null
    },
    categoryId: 642,
    chatEnabled: true,
    minuteRate: 2.99,
    tippingEnabled: true,

    title: 'Sample title1',
    advisorName: 'James Bond',
    salesPitch: 'Sample sales pitch 1',
    //use HTML from http://www.keen.com/psychic-readings/love-relationships/mignon-divine-medium/6604438 as a test =)
    profilePicture: 'http://imgupload.dev.ingenio.com/ad-products.cdn.originalmemberphotos/22768920-2133904112.jpg',

    //todo:
    specializedSituations: [
        { id: 1 }, 
        { id: 2 }
    ],
    skills: [
        { id: 1}, 
        { id: 6}, 
        { id: 12}
    ], 
    languages: [
        { id: 1}, 
        { id: 2 }, 
        { id: 3}
    ],
    approach: 'My sample approach',
    background: 'My background info',
    HTMLDescription: '<marquee>This is how advisors have their html description. <b>Its all crazy</b></marquee>'
}, {
    id: 2,
    primaryPhoneNumber: '(425) 999-99-89',
    categoryId: 642,
    advisorName: 'Muthu Vynogradenko',
    title: '',

    //todo:
    // specializedSituations: [{id:1},{id:2}],   //array of numbers
    // skills: [{id:1},{id:6},{id:12}],  //array of numbers
    // languages: [{id:1},{id:2},{id:3}],   //array of numbers

    approach: '',
    background: '',
    HTMLDescription: '<marquee>This is how advisors have their html description. <b>Its all crazy</b></marquee>'
}];