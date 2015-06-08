package eea.eprtr.Util;

import java.util.ArrayList;
import java.util.List;

import eea.eprtr.model.Wastetransfer;

public class DataHelperWasteTransfer {

	public DataHelperWasteTransfer()
	{
		
	}
	
	public List<Wastetransfer> getSubdata(String type, List<Wastetransfer> elements,boolean regionsearch)
	{
		switch(type.toUpperCase())
		{
		case "SUMMARY":
			return getSummary(elements);
		case "ACTIVITIES":
			return getActivitet(elements);
		case "AREAS":
			return getAreas(elements,regionsearch);
		case "AREACOMPARISON":
			return null;
		case "FACILITIES":
			return updateFacilities(elements);
		case "HAZTRANSBOUNDARY":
			return null;
		case "HAZRECEIVERS":
			return null;
		case "CONFIDENTIALITY":
			return null;
		case "AREAOVERVIEW":
			return null;//getAreaOverview(elements);
		default:
			return null;
		}
		
	}
	
	private Wastetransfer findGroupe(List<Wastetransfer> list, String key)
	{
		 for(Wastetransfer obj : list){
			 if(obj.key.equals(key))
			 {
				 return obj;
			 }
		 }
		 return null;
	}
	
	private boolean testUnspec(List<Wastetransfer> elements, Wastetransfer testelement)
	{
		for(Wastetransfer obj : elements)
		{
			if(obj.getIaActivityCode().equals(testelement.getIaActivityCode()) && obj.getIaSubActivityCode() != null &&
					!obj.getIaSubActivityCode().equals(""))
			{
				return true;
			}
		}
		return false;
	}
	
	private List<Wastetransfer> getSummary(List<Wastetransfer> elements)
	{
		List<Wastetransfer> list = new ArrayList<Wastetransfer>();
		Wastetransfer wt = new Wastetransfer();
		wt.wastetype ="NONHW";
		list.add(wt);
		
		wt = new Wastetransfer();
		wt.wastetype ="HW";
		list.add(wt);
		
		wt = new Wastetransfer();
		wt.wastetype ="HWIC";
		list.add(wt);
		
		wt = new Wastetransfer();
		wt.wastetype ="HWOC";
		list.add(wt);
		
		for(Wastetransfer obj : elements)
		{
			if(obj.isHasReportedRecovery())
			{
				list.get(0).quantityRecovery += obj.getQuantityRecoveryNONHW();
				list.get(1).quantityRecovery += obj.getQuantityRecoveryHW();
				list.get(2).quantityRecovery += obj.getQuantityRecoveryHWIC();
				list.get(3).quantityRecovery += obj.getQuantityRecoveryHWOC();
			}
			if(obj.isHasReportedDisposal())
			{
				list.get(0).quantityDisposal += obj.getQuantityDisposalNONHW();
				list.get(1).quantityDisposal += obj.getQuantityDisposalHW();
				list.get(2).quantityDisposal += obj.getQuantityDisposalHWIC();
				list.get(3).quantityDisposal += obj.getQuantityDisposalHWOC();
			}
			if(obj.isHasReportedUnspecified())
			{
				list.get(0).quantityUnspec += obj.getQuantityUnspecNONHW();
				list.get(1).quantityUnspec += obj.getQuantityUnspecHW();
				list.get(2).quantityUnspec += obj.getQuantityUnspecHWIC();
				list.get(3).quantityUnspec += obj.getQuantityUnspecHWOC();
			}
			
			if(obj.getQuantityTotalNONHW() > 0)
			{
				list.get(0).facilityCountNONHW +=1;
				list.get(0).facilityCount +=1;
			}
			if(obj.getQuantityTotalHW() > 0)
			{
				list.get(1).facilityCountHW +=1;
				list.get(1).facilityCount +=1;
			}
			if(obj.getQuantityTotalHWIC() > 0)
			{
				list.get(2).facilityCountHWIC +=1;
				list.get(2).facilityCount +=1;
			}
			if(obj.getQuantityTotalHWOC() > 0)
			{
				list.get(3).facilityCountHWOC +=1;
				list.get(3).facilityCount +=1;
			}
		}
		list.get(0).quantityTotal = list.get(0).quantityRecovery + list.get(0).quantityDisposal + list.get(0).quantityUnspec;
		list.get(1).quantityTotal = list.get(1).quantityRecovery + list.get(1).quantityDisposal + list.get(1).quantityUnspec;
		list.get(2).quantityTotal = list.get(2).quantityRecovery + list.get(2).quantityDisposal + list.get(2).quantityUnspec;
		list.get(3).quantityTotal = list.get(3).quantityRecovery + list.get(3).quantityDisposal + list.get(3).quantityUnspec;
		return list;
	}

	/*private List<Wastetransfer> getAreaOverview(List<Wastetransfer> elements)
	{
		List<Wastetransfer> list = new ArrayList<Wastetransfer>();
		Wastetransfer wt = new Wastetransfer();
		wt.wastetype ="NONHW";
		list.add(wt);
		
		wt = new Wastetransfer();
		wt.wastetype ="HW";
		list.add(wt);
		
		wt = new Wastetransfer();
		wt.wastetype ="HWIC";
		list.add(wt);
		
		wt = new Wastetransfer();
		wt.wastetype ="HWOC";
		list.add(wt);
		
		for(Wastetransfer obj : elements)
		{
			if(obj.isHasReportedRecovery())
			{
				list.get(0).quantityRecovery += obj.getQuantityRecoveryNONHW();
				list.get(1).quantityRecovery += obj.getQuantityRecoveryHW();
				list.get(2).quantityRecovery += obj.getQuantityRecoveryHWIC();
				list.get(3).quantityRecovery += obj.getQuantityRecoveryHWOC();
			}
			if(obj.isHasReportedDisposal())
			{
				list.get(0).quantityDisposal += obj.getQuantityDisposalNONHW();
				list.get(1).quantityDisposal += obj.getQuantityDisposalHW();
				list.get(2).quantityDisposal += obj.getQuantityDisposalHWIC();
				list.get(3).quantityDisposal += obj.getQuantityDisposalHWOC();
			}
			if(obj.isHasReportedUnspecified())
			{
				list.get(0).quantityUnspec += obj.getQuantityUnspecNONHW();
				list.get(1).quantityUnspec += obj.getQuantityUnspecHW();
				list.get(2).quantityUnspec += obj.getQuantityUnspecHWIC();
				list.get(3).quantityUnspec += obj.getQuantityUnspecHWOC();
			}
			
			if(obj.getQuantityTotalNONHW() > 0)
			{
				list.get(0).facilityCountNONHW +=1;
				list.get(0).facilityCount +=1;
			}
			if(obj.getQuantityTotalHW() > 0)
			{
				list.get(1).facilityCountHW +=1;
				list.get(1).facilityCount +=1;
			}
			if(obj.getQuantityTotalHWIC() > 0)
			{
				list.get(2).facilityCountHWIC +=1;
				list.get(2).facilityCount +=1;
			}
			if(obj.getQuantityTotalHWOC() > 0)
			{
				list.get(3).facilityCountHWOC +=1;
				list.get(3).facilityCount +=1;
			}
		}
		list.get(0).quantityTotal = list.get(0).quantityRecovery + list.get(0).quantityDisposal + list.get(0).quantityUnspec;
		list.get(1).quantityTotal = list.get(1).quantityRecovery + list.get(1).quantityDisposal + list.get(1).quantityUnspec;
		list.get(2).quantityTotal = list.get(2).quantityRecovery + list.get(2).quantityDisposal + list.get(2).quantityUnspec;
		list.get(3).quantityTotal = list.get(3).quantityRecovery + list.get(3).quantityDisposal + list.get(3).quantityUnspec;
		return list;
	}
*/
	
	private List<Wastetransfer> updateFacilities(List<Wastetransfer> elements)
	{
		List<Wastetransfer> list = new ArrayList<Wastetransfer>();
		for(Wastetransfer obj: elements)
		{
			obj.setQuantityTotal();
			obj.setQuantityRecovery();
			obj.setQuantityDisposal();
			obj.setQuantityUnspec();
			list.add(obj);
		}
		return list;
	}
	private List<Wastetransfer> getActivitet(List<Wastetransfer> elements)
	{
		List<Wastetransfer> list = new ArrayList<Wastetransfer>();
		List<Wastetransfer> sublist = new ArrayList<Wastetransfer>();
		for(Wastetransfer obj: elements)
		{
			Wastetransfer element  = findGroupe(list, obj.getIaSectorCode());
			if(element == null)
			{
				element = new Wastetransfer();
				element.key = obj.getIaSectorCode();
				element.data = new ArrayList<Wastetransfer>();	
				list.add(element);
			}
			
			boolean exist = false;
			for(int j = 0;j< element.data.size(); j++)
    		{	
    			if(element.data.get(j).getIaActivityCode().equals(obj.getIaActivityCode()))
    			{	
    				exist = true;
    				if(element.data.get(j).isHasReportedRecovery())
    				{
    					if(obj.getQuantityRecoveryNONHW() > 0)
    					{	
    						element.data.get(j).setQuantityRecoveryNONHW(element.data.get(j).getQuantityRecoveryNONHW() + obj.getQuantityRecoveryNONHW());
    					}
    					/*if(obj.getQuantityRecoveryHW() > 0) -- NOT NEEDED
    					{	
    						element.data.get(j).setQuantityRecoveryHW(element.data.get(j).getQuantityRecoveryHW() + obj.getQuantityRecoveryHW());
    					}*/
    					if(obj.getQuantityRecoveryHWOC() > 0)
    					{
    						element.data.get(j).setQuantityRecoveryHWOC(element.data.get(j).getQuantityRecoveryHWOC() + obj.getQuantityRecoveryHWOC());	
    						//element.data.get(j).recovery += obj.getQuantityRecoveryHWOC();
    					}
    					if(obj.getQuantityRecoveryHWIC() > 0)
    					{
							element.data.get(j).setQuantityRecoveryHWIC(element.data.get(j).getQuantityRecoveryHWIC() + obj.getQuantityRecoveryHWIC());
    						//element.data.get(j).recovery += obj.getQuantityRecoveryHWIC();
    					}
    				}
    				
    				if(element.data.get(j).isHasReportedDisposal())
    				{
    					if(obj.getQuantityDisposalNONHW() > 0)
    					{
    						element.data.get(j).setQuantityDisposalNONHW(element.data.get(j).getQuantityDisposalNONHW() + obj.getQuantityDisposalNONHW());
    					}
    					if(obj.getQuantityDisposalHWIC() > 0)
    					{
    						element.data.get(j).setQuantityDisposalHWIC(element.data.get(j).getQuantityDisposalHWIC() + obj.getQuantityDisposalHWIC());
    						//element.data.get(j).disposal +=obj.getQuantityDisposalHWIC();
    					}
    					if(obj.getQuantityDisposalHWOC() > 0)
    					{
    						element.data.get(j).setQuantityDisposalHWOC(element.data.get(j).getQuantityDisposalHWOC() + obj.getQuantityDisposalHWOC());
    						//element.data.get(j).disposal +=obj.getQuantityDisposalHWOC();
    					}
    				}
    			
    				if(element.data.get(j).isHasReportedUnspecified())
    				{
    					if(obj.getQuantityUnspecNONHW() > 0)
    					{
    					
    						element.data.get(j).setQuantityUnspecNONHW(element.data.get(j).getQuantityUnspecNONHW() + obj.getQuantityUnspecNONHW());
    					}
    					if(obj.getQuantityUnspecHWIC() > 0)
    					{
    						element.data.get(j).setQuantityUnspecHWIC(element.data.get(j).getQuantityUnspecHWIC() + obj.getQuantityUnspecHWIC());
    						//element.data.get(j).unspec +=  obj.getQuantityUnspecHWIC();
    					}
    					if(obj.getQuantityUnspecHWOC() > 0)
    					{
    						element.data.get(j).setQuantityUnspecHWOC(element.data.get(j).getQuantityUnspecHWOC() + obj.getQuantityUnspecHWOC());
    						//element.data.get(j).unspec +=obj.getQuantityUnspecHWOC();
    					}		
    				}
    			
    				// Total		
    				if(obj.getQuantityTotalHWIC() > 0)
					{
						element.data.get(j).setQuantityTotalHWIC(element.data.get(j).getQuantityTotalHWIC() + obj.getQuantityTotalHWIC());
						element.data.get(j).facilityCountHWIC+=1;
					}
    				if(obj.getQuantityTotalHWOC() > 0)
					{
    					element.data.get(j).setQuantityTotalHWOC(element.data.get(j).getQuantityTotalHWOC() + obj.getQuantityTotalHWOC());
    					element.data.get(j).facilityCountHWOC+=1;
					}
    				if(obj.getQuantityTotalNONHW() > 0)
					{
    					element.data.get(j).setQuantityTotalNONHW(element.data.get(j).getQuantityTotalNONHW() + obj.getQuantityTotalNONHW());
    					element.data.get(j).facilityCountNONHW+=1;
					}

    				
    				if(obj.getQuantityTotalHWOC() > 0 || obj.getQuantityTotalHWIC() > 0)
    				{
    					element.data.get(j).facilityCountHW+=1;
    					//element.data.get(j).total += obj.getQuantityTotalHWOC();
    				}
    				/*if(obj.getQuantityTotalHWIC() > 0)
    				{
    					element.data.get(j).total += obj.getQuantityTotalHWIC();
    				}*/
    				element.data.get(j).facilityCount+=1;
    				break;
    			}
    		}// End foreach

			if(obj.getIaSubActivityCode() != null && !obj.getIaSubActivityCode().trim().equals("")) 
			{
				try {
					sublist.add((Wastetransfer)obj.clone());
				} catch (CloneNotSupportedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}else
			{
				if(testUnspec(elements, obj))
				{
					obj.setIaSubActivityCode("unspecified");
					try {
						sublist.add((Wastetransfer)obj.clone());
					} catch (CloneNotSupportedException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
			if(!exist)
    		{
				if(obj.getQuantityTotalNONHW() > 0)
				{
					obj.facilityCountNONHW=1;
				}
				if (obj.getQuantityTotalHWIC() > 0)
				{
					obj.facilityCountHWIC=1;
				}
				if(obj.getQuantityTotalHWOC() > 0)
				{
					obj.facilityCountHWIC=1;
				}
				if (obj.getQuantityTotalHWIC() > 0 || obj.getQuantityTotalHWOC() > 0)
				{
					obj.facilityCountHW=1;
				}
    			obj.facilityCount = 1;
    			element.data.add(obj);
    		}
		}
		// Create level 3
		for(int i = 0; i < sublist.size(); i++)
		{
			for(int j = 0; j < list.size(); j++)
			{
				if(list.get(j).key.equals(sublist.get(i).getIaSectorCode()))
				{
					for(int n = 0; n < list.get(j).data.size(); n++)
					{
						if(list.get(j).data.get(n).getIaActivityCode().equals(sublist.get(i).getIaActivityCode()))
						{
							List<Wastetransfer> sublevel = list.get(j).data.get(n).sublevel;
							if(sublevel == null || sublevel.size() == 0)
							{
								sublevel = new ArrayList<Wastetransfer>();
								list.get(j).data.get(n).sublevel = sublevel;
							}
							boolean sublevelexist = false;
							for(Wastetransfer slevel : sublevel)
							{
								if(slevel.getIaSubActivityCode().equals(sublist.get(i).getIaSubActivityCode()))
								{
									if(sublist.get(i).isHasReportedRecovery())
				    				{
				    					if(sublist.get(i).getQuantityRecoveryNONHW() > 0)
				    					{	
				    						slevel.setQuantityRecoveryNONHW(slevel.getQuantityRecoveryNONHW() + sublist.get(i).getQuantityRecoveryNONHW());
				    					}
				    					if(sublist.get(i).getQuantityRecoveryHWOC() > 0)
				    					{
				    						
				    						slevel.setQuantityRecoveryHWOC(slevel.getQuantityRecoveryHWOC() + sublist.get(i).getQuantityRecoveryHWOC());	
				    						//slevel.recovery += sublist.get(i).getQuantityRecoveryHWOC();
				    					}
				    					if(sublist.get(i).getQuantityRecoveryHWIC() > 0)
				    					{
				    						slevel.setQuantityRecoveryHWIC(slevel.getQuantityRecoveryHWIC() + sublist.get(i).getQuantityRecoveryHWIC());
				    						//slevel.recovery += sublist.get(i).getQuantityRecoveryHWIC();
				    					}
				    				}
				    				
				    				if(sublist.get(i).isHasReportedDisposal())
				    				{
				    					if(sublist.get(i).getQuantityDisposalNONHW() > 0)
				    					{
				    						slevel.setQuantityDisposalNONHW(slevel.getQuantityDisposalNONHW() + sublist.get(i).getQuantityDisposalNONHW());
				    					}
				    					if(sublist.get(i).getQuantityDisposalHWIC() > 0)
				    					{
				    						slevel.setQuantityDisposalHWIC(slevel.getQuantityDisposalHWIC() + sublist.get(i).getQuantityDisposalHWIC());
				    						//slevel.disposal +=sublist.get(i).getQuantityDisposalHWIC();
				    					}
				    					if(sublist.get(i).getQuantityDisposalHWOC() > 0)
				    					{
				    						slevel.setQuantityDisposalHWOC(slevel.getQuantityDisposalHWOC() + sublist.get(i).getQuantityDisposalHWOC());
				    						//slevel.disposal +=sublist.get(i).getQuantityDisposalHWOC();
				    					}
				    				}
				    			
				    				if(sublist.get(i).isHasReportedUnspecified())
				    				{
				    					if(sublist.get(i).getQuantityUnspecNONHW() > 0)
				    					{
				    						slevel.setQuantityUnspecNONHW(slevel.getQuantityUnspecNONHW() + sublist.get(i).getQuantityUnspecNONHW());
				    					}
				    					if(sublist.get(i).getQuantityUnspecHWIC() > 0)
				    					{
				    						slevel.setQuantityUnspecHWIC(slevel.getQuantityUnspecHWIC() + sublist.get(i).getQuantityUnspecHWIC());
				    						//slevel.unspec +=  sublist.get(i).getQuantityUnspecHWIC();
				    					}
				    					if(sublist.get(i).getQuantityUnspecHWOC() > 0)
				    					{
				    						slevel.setQuantityUnspecHWOC(slevel.getQuantityUnspecHWOC() + sublist.get(i).getQuantityUnspecHWOC());
				    						//slevel.unspec +=sublist.get(i).getQuantityUnspecHWOC();
				    					}		
				    				}
				    			
				    				// Total		
				    				if(sublist.get(i).getQuantityTotalHWIC() > 0)
									{
				    					slevel.setQuantityTotalHWIC(slevel.getQuantityTotalHWIC() + sublist.get(i).getQuantityTotalHWIC());
				    					slevel.facilityCountHWIC+=1;
									}
				    				if(sublist.get(i).getQuantityTotalHWOC() > 0)
									{
				    					slevel.setQuantityTotalHWOC(slevel.getQuantityTotalHWOC() + sublist.get(i).getQuantityTotalHWOC());
				    					slevel.facilityCountHWOC+=1;
									}
				    				if(sublist.get(i).getQuantityTotalNONHW() > 0)
									{
				    					slevel.setQuantityTotalNONHW(slevel.getQuantityTotalNONHW() + sublist.get(i).getQuantityTotalNONHW());
				    					slevel.facilityCountNONHW+=1;
									}
				    				if(sublist.get(i).getQuantityTotalHWOC() > 0 || sublist.get(i).getQuantityTotalHWIC() > 0)
									{
				    					slevel.facilityCountHW+=1;
									}
				    				
				    				/*if(sublist.get(i).getQuantityTotalHWOC() > 0)
				    				{
				    					slevel.total += sublist.get(i).getQuantityTotalHWOC();
				    				}
				    				if(sublist.get(i).getQuantityTotalHWIC() > 0)
				    				{
				    					slevel.total += sublist.get(i).getQuantityTotalHWIC();
				    				}*/
									
									slevel.facilityCount +=1;
									sublevelexist = true;
									break;
								}
							}
							if(!sublevelexist)
							{
								if(sublist.get(i).getQuantityTotalNONHW() > 0)
								{
									sublist.get(i).facilityCountNONHW=1;
								}
								if (sublist.get(i).getQuantityTotalHWIC() > 0)
								{
									sublist.get(i).facilityCountHWIC=1;
								}
								if(sublist.get(i).getQuantityTotalHWOC() > 0)
								{
									sublist.get(i).facilityCountHWIC=1;
								}
								if (sublist.get(i).getQuantityTotalHWIC() > 0 || sublist.get(i).getQuantityTotalHWOC() > 0)
								{
									sublist.get(i).facilityCountHW=1;
								}
								sublist.get(i).facilityCount =1;
								sublevel.add(sublist.get(i));
							}
						}
					}
				}
			}
		}
		return list;
	}
	
	private List<Wastetransfer> getAreas(List<Wastetransfer> elements, boolean regionsearch)
	{	
		List<Wastetransfer> list = new ArrayList<Wastetransfer>();
		for(Wastetransfer obj: elements)
		{
			Wastetransfer element  = findGroupe(list, obj.getCountryCode());
			if(element == null)
			{
				element = new Wastetransfer();
				element.key = obj.getCountryCode();
				element.data = new ArrayList<Wastetransfer>();
				

				list.add(element);
			}
			
			boolean exist = false;
			for(Wastetransfer rec : element.data)
    		{	
    			
				if((regionsearch && rec.getNutsLevel2RegionCode().equals(obj.getNutsLevel2RegionCode())) ||
    				(!regionsearch && rec.getRiverBasinDistrictCode().equals(obj.getRiverBasinDistrictCode())))
    			{	
    				exist = true;
    				if(rec.isHasReportedRecovery())
    				{
    					if(obj.getQuantityRecoveryNONHW() > 0)
    					{	
    						rec.setQuantityRecoveryNONHW(rec.getQuantityRecoveryNONHW() + obj.getQuantityRecoveryNONHW());
    					}
    					if(obj.getQuantityRecoveryHWOC() > 0)
    					{
    						rec.setQuantityRecoveryHWOC(rec.getQuantityRecoveryHWOC() + obj.getQuantityRecoveryHWOC());	
    						//rec.recovery += obj.getQuantityRecoveryHWOC();
    					}
    					if(obj.getQuantityRecoveryHWIC() > 0)
    					{
							rec.setQuantityRecoveryHWIC(rec.getQuantityRecoveryHWIC() + obj.getQuantityRecoveryHWIC());
    						//rec.recovery += obj.getQuantityRecoveryHWIC();
    					}
    				}
    				
    				if(rec.isHasReportedDisposal())
    				{
    					if(obj.getQuantityDisposalNONHW() > 0)
    					{
    						rec.setQuantityDisposalNONHW(rec.getQuantityDisposalNONHW() + obj.getQuantityDisposalNONHW());
    					}
    					if(obj.getQuantityDisposalHWIC() > 0)
    					{
    						rec.setQuantityDisposalHWIC(rec.getQuantityDisposalHWIC() + obj.getQuantityDisposalHWIC());
    						//rec.disposal +=obj.getQuantityDisposalHWIC();
    					}
    					if(obj.getQuantityDisposalHWOC() > 0)
    					{
    						rec.setQuantityDisposalHWOC(rec.getQuantityDisposalHWOC() + obj.getQuantityDisposalHWOC());
    						//rec.disposal +=obj.getQuantityDisposalHWOC();
    					}
    				}
    			
    				if(rec.isHasReportedUnspecified())
    				{
    					if(obj.getQuantityUnspecNONHW() > 0)
    					{
    					
    						rec.setQuantityUnspecNONHW(rec.getQuantityUnspecNONHW() + obj.getQuantityUnspecNONHW());
    					}
    					if(obj.getQuantityUnspecHWIC() > 0)
    					{
    						rec.setQuantityUnspecHWIC(rec.getQuantityUnspecHWIC() + obj.getQuantityUnspecHWIC());
    						//rec.unspec +=  obj.getQuantityUnspecHWIC();
    					}
    					if(obj.getQuantityUnspecHWOC() > 0)
    					{
    						rec.setQuantityUnspecHWOC(rec.getQuantityUnspecHWOC() + obj.getQuantityUnspecHWOC());
    						//rec.unspec +=obj.getQuantityUnspecHWOC();
    					}		
    				}
    			
    				// Total		
    				if(obj.getQuantityTotalHWIC() > 0)
					{
						rec.setQuantityTotalHWIC(rec.getQuantityTotalHWIC() + obj.getQuantityTotalHWIC());
						rec.facilityCountHWIC+=1;
					}
    				if(obj.getQuantityTotalHWOC() > 0)
					{
    					rec.setQuantityTotalHWOC(rec.getQuantityTotalHWOC() + obj.getQuantityTotalHWOC());
    					rec.facilityCountHWOC+=1;
					}
    				if(obj.getQuantityTotalNONHW() > 0)
					{
    					rec.setQuantityTotalNONHW(rec.getQuantityTotalNONHW() + obj.getQuantityTotalNONHW());
    					rec.facilityCountNONHW+=1;
					}
    				if(obj.getQuantityTotalHWIC() > 0 || obj.getQuantityTotalHWOC() > 0)
					{
    					rec.facilityCountHW+=1;
					}    				
    				/*if(obj.getQuantityTotalHWOC() > 0)
    				{
    					rec.total += obj.getQuantityTotalHWOC();
    				}
    				if(obj.getQuantityTotalHWIC() > 0)
    				{
    					rec.total += obj.getQuantityTotalHWIC();
    				}*/
    				rec.facilityCount+=1;
    				break;
    			}
    		}// End foreach

			if(!exist)
    		{
				if(obj.getQuantityTotalNONHW() > 0)
				{
					obj.facilityCountNONHW=1;
				}
				if (obj.getQuantityTotalHWIC() > 0)
				{
					obj.facilityCountHWIC=1;
				}
				if(obj.getQuantityTotalHWOC() > 0)
				{
					obj.facilityCountHWIC=1;
				}
				if (obj.getQuantityTotalHWIC() > 0 || obj.getQuantityTotalHWOC() > 0)
				{
					obj.facilityCountHW=1;
				}
				obj.facilityCount = 1;
    			element.data.add(obj);
    			
    		}
		}
		System.out.println("List size: "+list.size());
		return list;
	} 
	
}
