package eea.eprtrcms.model;

import java.io.Serializable;
import java.util.Objects;

import javax.persistence.*;


/**
 * The persistent class for the StringResource database table.
 *
 */
@Entity
@NamedQuery(name="StringResource.findAll", query="SELECT s FROM StringResource s")
public class StringResource implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @Column(name="CultureCode")
    private String i18n;

    @Id
    @Column(name="ResourceKey")
    private String key;

    @Id
    @Column(name="ResourceType")
    private String type;

    @Column(name="ResourceValue")
    private String val;

    public StringResource() {
    }

    public String getCultureCode() {
        return this.i18n;
    }

    public void setCultureCode(String cultureCode) {
        this.i18n = cultureCode;
    }

    public String getResourceKey() {
        return this.key;
    }

    public void setResourceKey(String resourceKey) {
        this.key = resourceKey;
    }

    public String getResourceType() {
        return this.type;
    }

    public void setResourceType(String resourceType) {
        this.type = resourceType;
    }

    public String getResourceValue() {
        return this.val;
    }

    public void setResourceValue(String resourceValue) {
        this.val = resourceValue;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 67 * hash + Objects.hashCode(this.i18n);
        hash = 67 * hash + Objects.hashCode(this.key);
        hash = 67 * hash + Objects.hashCode(this.type);
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
        final StringResource other = (StringResource) obj;
        if (!Objects.equals(this.i18n, other.i18n)) {
            return false;
        }
        if (!Objects.equals(this.key, other.key)) {
            return false;
        }
        if (!Objects.equals(this.type, other.type)) {
            return false;
        }
        return true;
    }

    
    
}
