package com.gotacar.backend.models.Trip;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Circle;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

public class TripRepositoryImpl implements TripRepositoryCustom {
    private final MongoTemplate mongoTemplate;

    @Autowired
    public TripRepositoryImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public List<Trip> searchTrips(Point startingPoint, Point endindPoint, Integer places, LocalDateTime date) {
        Circle circleStart = new Circle(startingPoint, 0.012);
        Circle circleEnd = new Circle(endindPoint, 0.012);

        Query query = new Query();
        List<Criteria> criteria = new ArrayList<>();

        Integer diaActual= date.getDayOfMonth();
        Integer mesActual = date.getMonthValue();
        Integer anoActual = date.getYear();
        Boolean bisiesto = false;

        bisiesto = (anoActual%400 == 0 || anoActual%4 == 0) && !(anoActual%100== 0) ?true:false;
        diaActual = diaActual+1>Month.of(mesActual).length(bisiesto)?1:diaActual+1;
        mesActual = diaActual==1?mesActual+1:mesActual;
		mesActual = mesActual>12?1:mesActual;
        anoActual=mesActual+1>12?anoActual+1:anoActual;

        LocalDateTime diaSiguiente = LocalDateTime.of(anoActual, Month.of(mesActual), diaActual, 0, 0, 0);
        
        if (startingPoint != null) {
            criteria.add(Criteria.where("startingPoint").within(circleStart));
        }

        if (places != null) {
            criteria.add(Criteria.where("places").gte(places));
        }

        if (date != null) {
            criteria.add(Criteria.where("startDate").gte(date).lt(diaSiguiente));

        }

        if (!criteria.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteria.toArray(new Criteria[criteria.size()])));
        }

        List<Trip> viajesPuntoEmpezar = mongoTemplate.find(query, Trip.class);
        

        query = new Query();
        criteria = new ArrayList<>();

        List<String> ids = viajesPuntoEmpezar.stream().map(x -> x.getId()).collect(Collectors.toList());

        criteria.add(Criteria.where("id").in(ids));

        if (endindPoint != null) {
            criteria.add(Criteria.where("endingPoint").within(circleEnd));
        }

        if (!criteria.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteria.toArray(new Criteria[criteria.size()])));
        }

        return mongoTemplate.find(query, Trip.class);
    }

}
