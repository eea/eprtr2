package eea.eprtrcms.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import eea.eprtrcms.model.DataImport;

@Service
public class LatestDataImportJdbc {

    @Autowired
    private DataSource dataSource;

/*
    public void setDataSource(DataSource dataSource) {
        this.dataSource = dataSource;
    }
*/
    public Timestamp getLatestImport() {
        String query = "SELECT TOP 1 Published FROM LATEST_DATAIMPORT ORDER BY Published DESC";
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);

        return jdbcTemplate.queryForObject(query, Timestamp.class);
    }

    /**
     * Get all data imports in reverse chronological order.
     */
    public List<DataImport> getAll() {
        String query = "SELECT ReportingYear, LOV_COUNTRY.Name AS Country, ForReview, Published FROM LATEST_DATAIMPORT"
                + " JOIN LOV_COUNTRY ON LATEST_DATAIMPORT.LOV_CountryID=LOV_COUNTRY.LOV_CountryID"
                + " ORDER BY ReportingYear DESC, LOV_COUNTRY.Name";
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        return jdbcTemplate.query(query, new BeanPropertyRowMapper<DataImport>(DataImport.class));
    }

}
