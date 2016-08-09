package eea.eprtrcms.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

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

}
