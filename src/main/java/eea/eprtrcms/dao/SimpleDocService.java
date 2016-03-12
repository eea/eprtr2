package eea.eprtrcms.dao;

import java.util.List;

import eea.eprtrcms.model.SimpleDoc;

//CRUD operations
public interface SimpleDocService {

    /**
     * Save a document.
     */
    void save(SimpleDoc doc);

    /**
     * Read.
     */
    SimpleDoc getByResourceValueID(int valueID);

    //Update
    //void update(SimpleDoc doc);

    //Delete
    //void deleteById(int id);

    /**
     * Get All.
     */
    List<SimpleDoc> getAll();
}
