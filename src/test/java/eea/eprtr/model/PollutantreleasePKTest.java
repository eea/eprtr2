package eea.eprtr.model;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import org.junit.Before;
import org.junit.Test;

/**
 * 
 * @author Vasilis Skiadas<vs@eworx.gr>
 */
public class PollutantreleasePKTest {

    PollutantreleasePK x;
    PollutantreleasePK y;
    PollutantreleasePK z;
    PollutantreleasePK notx;

    @Before
    public void initialize() {
        x = new PollutantreleasePK(42, 2013);

        y = new PollutantreleasePK(42, 2013);;

        z = new PollutantreleasePK(42, 2013);;

        notx = new PollutantreleasePK(2, 2000);

    }

    @Test
    /**
     * A class is equal to itself.
     */
    public void testEqual_ToSelf() {

        assertTrue("Class equal to itself.", x.equals(x));
    }

    /**
     * x.equals(WrongType) must return false;
     *
     */
    @Test
    public void testPassIncompatibleType_isFalse() {

        assertFalse("Passing incompatible object to equals should return false", x.equals("string"));
    }

    /**
     * x.equals(null) must return false;
     *
     */
    @Test
    public void testNullReference_isFalse() {

        assertFalse("Passing null to equals should return false", x.equals(null));
    }

    /**
     * 1. x, x.equals(x) must return true. 2. x and y, x.equals(y) must return
     * true if and only if y.equals(x) returns true.
     */
    @Test
    public void testEquals_isReflexive_isSymmetric() {

        assertTrue("Reflexive test fail x,y", x.equals(y));
        assertTrue("Symmetric test fail y", y.equals(x));

    }

    /**
     * 1. x.equals(y) returns true 2. y.equals(z) returns true 3. x.equals(z)
     * must return true
     */
    @Test
    public void testEquals_isTransitive() {

        assertTrue("Transitive test fails x,y", x.equals(y));
        assertTrue("Transitive test fails y,z", y.equals(z));
        assertTrue("Transitive test fails x,z", x.equals(z));
    }

    /**
     * Repeated calls to equals consistently return true or false.
     */
    @Test
    public void testEquals_isConsistent() {

        assertTrue("Consistent test fail x,y", x.equals(y));
        assertTrue("Consistent test fail x,y", x.equals(y));
        assertTrue("Consistent test fail x,y", x.equals(y));
        assertFalse(notx.equals(x));
        assertFalse(notx.equals(x));
        assertFalse(notx.equals(x));

    }

    /**
     * Repeated calls to hashcode should consistently return the same integer.
     */
    @Test
    public void testHashcode_isConsistent() {

        int initial_hashcode = x.hashCode();

        assertEquals("Consistent hashcode test fails", initial_hashcode, x.hashCode());
        assertEquals("Consistent hashcode test fails", initial_hashcode, x.hashCode());
    }

    /**
     * Objects that are equal using the equals method should return the same
     * integer.
     */
    @Test
    public void testHashcode_twoEqualsObjects_produceSameNumber() {

        int xhashcode = x.hashCode();
        int yhashcode = y.hashCode();

        assertEquals("Equal object, return equal hashcode test fails", xhashcode, yhashcode);
    }

    /**
     * A more optimal implementation of hashcode ensures that if the objects are
     * unequal different integers are produced.
     *
     */
    @Test
    public void testHashcode_twoUnEqualObjects_produceDifferentNumber() {

        int xhashcode = x.hashCode();
        int notxHashcode = notx.hashCode();

        assertTrue("Equal object, return unequal hashcode test fails", !(xhashcode == notxHashcode));
    }

}
