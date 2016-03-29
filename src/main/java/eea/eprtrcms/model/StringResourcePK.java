/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package eea.eprtrcms.model;

import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Id;

/**
 *
 * @author Vasilis Skiadas<vs@eworx.gr>
 */
public class StringResourcePK implements Serializable {

    private String i18n;

    private String key;

    public StringResourcePK() {
    }

    public StringResourcePK(String i18n, String key) {
        this.i18n = i18n;
        this.key = key;
    }

    @Override
    public int hashCode() {
        int hash = 5;
        hash = 17 * hash + Objects.hashCode(this.i18n);
        hash = 17 * hash + Objects.hashCode(this.key);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final StringResourcePK other = (StringResourcePK) obj;
        if (!Objects.equals(this.i18n, other.i18n)) {
            return false;
        }
        if (!Objects.equals(this.key, other.key)) {
            return false;
        }
        return true;
    }

}
