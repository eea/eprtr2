package eea.eprtrcms.dao;

import java.util.List;

import eea.eprtrcms.model.Culture;

public interface CultureService {

    //Create
    //void save(Culture doc);

    //Read
    Culture getByEnglishName(String name);

    //Update
    //void update(Culture doc);

    //Delete
    //void deleteById(int id);

    //Get All
    List<Culture> getAll();
}
