import got from 'got';
import * as Cheerio from 'cheerio';

export default class Place {
    static async fromLandmark(landmark) {
        return await this.fromFilter(landmark.id);
    }

    static async fromFilter(filter) {
        const response = await got(`https://www.bing.com/maps/overlaybfpr?filters=${filter}&count=1`);
        return this.fromResponse(response.body);
    }

    static async fromQuery(q) {
        const response = await got(`https://www.bing.com/maps/overlaybfpr?q=${q}&count=1`);
        return this.fromResponse(response.body);
    }

    static fromResponse(response) {
        const $ = Cheerio.load(response);

        if ($('.errmsg').length > 0) {
            return null;
        }

        const data = {};

        this._extractDataFromContainer($('.overlay-container'), data);
        this._extractDataFromContainer($('.overlay-taskpane'), data);
        this._extractReviews($('.reviews_rct'), data);

        return new Place(data);
    }

    constructor(rawData) {
        this.type = rawData.segmenttype;
        this._parseEntity(rawData.entity);

        if (rawData.facts) {
            this._parseFacts(rawData.facts);
        }

        if (rawData.itineraryfacts) {
            this._parseItineraryFacts(rawData.itineraryfacts);
        }

        if (rawData.revdata) {
            this._parseReviews(rawData.revdata);
        }
    }

    _parseEntity(entity) {
        const { geometry, routablePoint, entity: { title, id, imageUrl, primaryCategory, website } } = entity;

        this.bounds = geometry.bounds;
        this.location = routablePoint;
        this.name = title;
        this.id = id;
        this.thumbnail = imageUrl;
        this.category = primaryCategory;
        this.website = website;
    }

    _parseFacts(facts) {
        const { languageCultureName, addressFields, openHours } = facts;

        this.localizationLang = languageCultureName;
        this.address = addressFields;
        this.openHours = openHours;
    }

    _parseItineraryFacts(itineraryFacts) {
        const { PhoneNumber, Rating, PriceInfo, Categories } = itineraryFacts;

        this.phone = PhoneNumber;
        this.rating = Rating
            ? {
                score: Rating.Rating,
                count: Rating.TotalNo,
                provider: Rating.Provider
            }
            : null;
        this.price = PriceInfo;
        this.categories = Categories;
    }

    _parseReviews(reviews) {
        this.reviews = reviews.Reviews.Values.map(review => ({
            text: review.Text,
            score: review.Rating.ReviewRating,
            author: review.Rating.ReviewerName,
            date: new Date(review.Rating.ReviewTimeStamp),
            link: review.FullReviewLink.Url,
            provider: review.Rating.ProviderName
        }));
    }

    static _extractDataFromContainer(container, data) {
        const containerData = container.data();
        Object.assign(data, containerData);
    }

    static _extractReviews(reviewsContainer, data) {
        if (reviewsContainer.length > 0) {
            const revdata = reviewsContainer.attr('revdata');
            data.revdata = JSON.parse(revdata);
        }
    }
}
