package eea.eprtr.Util;

import java.util.ArrayList;
import java.util.List;

import eea.eprtr.model.WasteTransferConfidentialTS;
import eea.eprtr.model.WasteType;
import eea.eprtr.model.Wastetransfer;
import eea.eprtr.model.WastetransferConfidential;

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
			return null;
		case "HAZTRANSBOUNDARY":
			return null;
		case "HAZRECEIVERS":
			return null;
		case "CONFIDENTIALITY":
			return null;
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
			if(obj.getIaActivityCode() == testelement.getIaActivityCode() && obj.getIaSubActivityCode() != null &&
					obj.getIaSubActivityCode() != "")
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
		wt.wastetype ="NON-HW";
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
				list.get(0).recovery += obj.getQuantityRecoveryNONHW();
				list.get(1).recovery += obj.getQuantityRecoveryHWIC() + obj.getQuantityRecoveryHWOC();
				list.get(2).recovery += obj.getQuantityRecoveryHWIC();
				list.get(3).recovery += obj.getQuantityRecoveryHWOC();
			}
			if(obj.isHasReportedDisposal())
			{
				list.get(0).disposal += obj.getQuantityDisposalNONHW();
				list.get(1).disposal += obj.getQuantityDisposalHWIC() + obj.getQuantityDisposalHWOC();
				list.get(2).disposal += obj.getQuantityDisposalHWIC();
				list.get(3).disposal += obj.getQuantityDisposalHWOC();
			}
			if(obj.isHasReportedUnspecified())
			{
				list.get(0).unspec += obj.getQuantityUnspecNONHW();
				list.get(1).unspec += obj.getQuantityUnspecHWIC() + obj.getQuantityUnspecHWOC();
				list.get(2).unspec += obj.getQuantityUnspecHWIC();
				list.get(3).unspec += obj.getQuantityUnspecHWOC();
			}
			
			if(obj.getQuantityTotalNONHW() > 0)
			{
				list.get(0).facilityCount +=1;
			}
			if(obj.getQuantityTotalHWOC() > 0 || obj.getQuantityTotalHWIC() > 0)
			{
				list.get(1).facilityCount +=1;
			}
			if(obj.getQuantityTotalHWIC() > 0)
			{
				list.get(2).facilityCount +=1;
			}
			if(obj.getQuantityTotalHWOC() > 0)
			{
				list.get(3).facilityCount +=1;
			}
		}
		list.get(0).total = list.get(0).recovery + list.get(0).disposal + list.get(0).unspec;
		list.get(1).total = list.get(1).recovery + list.get(1).disposal + list.get(1).unspec;
		list.get(2).total = list.get(2).recovery + list.get(2).disposal + list.get(2).unspec;
		list.get(3).total = list.get(3).recovery + list.get(3).disposal + list.get(3).unspec;
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
    					if(obj.getQuantityRecoveryHWOC() > 0)
    					{
    						element.data.get(j).setQuantityRecoveryHWOC(element.data.get(j).getQuantityRecoveryHWOC() + obj.getQuantityRecoveryHWOC());	
    						element.data.get(j).recovery += obj.getQuantityRecoveryHWOC();
    					}
    					if(obj.getQuantityRecoveryHWIC() > 0)
    					{
							element.data.get(j).setQuantityRecoveryHWIC(element.data.get(j).getQuantityRecoveryHWIC() + obj.getQuantityRecoveryHWIC());
    						element.data.get(j).recovery += obj.getQuantityRecoveryHWIC();
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
    						element.data.get(j).disposal +=obj.getQuantityDisposalHWIC();
    					}
    					if(obj.getQuantityDisposalHWOC() > 0)
    					{
    						element.data.get(j).setQuantityDisposalHWOC(element.data.get(j).getQuantityDisposalHWOC() + obj.getQuantityDisposalHWOC());
    						element.data.get(j).disposal +=obj.getQuantityDisposalHWOC();
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
    						element.data.get(j).unspec +=  obj.getQuantityUnspecHWIC();
    					}
    					if(obj.getQuantityUnspecHWOC() > 0)
    					{
    						element.data.get(j).setQuantityUnspecHWOC(element.data.get(j).getQuantityUnspecHWOC() + obj.getQuantityUnspecHWOC());
    						element.data.get(j).unspec +=obj.getQuantityUnspecHWOC();
    					}		
    				}
    			
    				// Total		
    				if(obj.getQuantityTotalHWIC() > 0)
					{
						element.data.get(j).setQuantityTotalHWIC(element.data.get(j).getQuantityTotalHWIC() + obj.getQuantityTotalHWIC());
					}
    				if(obj.getQuantityTotalHWOC() > 0)
					{
    					element.data.get(j).setQuantityTotalHWOC(element.data.get(j).getQuantityTotalHWOC() + obj.getQuantityTotalHWOC());
					}
    				if(obj.getQuantityTotalNONHW() > 0)
					{
    					element.data.get(j).setQuantityTotalNONHW(element.data.get(j).getQuantityTotalNONHW() + obj.getQuantityTotalNONHW());
					}
    				
    				if(obj.getQuantityTotalHWOC() > 0)
    				{
    					element.data.get(j).total += obj.getQuantityTotalHWOC();
    				}
    				if(obj.getQuantityTotalHWIC() > 0)
    				{
    					element.data.get(j).total += obj.getQuantityTotalHWIC();
    				}
    				element.data.get(j).facilityCount+=1;
    				break;
    			}
    		}// End foreach

			if(obj.getIaSubActivityCode() != null && obj.getIaSubActivityCode().trim() != "") 
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
				if(obj.isHasReportedRecovery())
				{
					if(obj.getQuantityRecoveryHWOC() > 0)
					{
						obj.recovery += obj.getQuantityRecoveryHWOC();
					}
					if(obj.getQuantityRecoveryHWIC() > 0)
					{
						obj.recovery += obj.getQuantityRecoveryHWIC();
					}
				}
				
				if(obj.isHasReportedDisposal())
				{
					
					if(obj.getQuantityDisposalHWIC() > 0)
					{
						obj.disposal +=obj.getQuantityDisposalHWIC();
					}
					if(obj.getQuantityDisposalHWOC() > 0)
					{
						obj.disposal +=obj.getQuantityDisposalHWOC();
					}
				}
			
				if(obj.isHasReportedUnspecified())
				{
				
					if(obj.getQuantityUnspecHWIC() > 0)
					{
						obj.unspec +=  obj.getQuantityUnspecHWIC();
					}
					if(obj.getQuantityUnspecHWOC() > 0)
					{
						obj.unspec +=obj.getQuantityUnspecHWOC();
					}		
				}
				
				if(obj.getQuantityTotalHWOC() > 0)
				{
					obj.total += obj.getQuantityTotalHWOC();
				}
				if(obj.getQuantityTotalHWIC() > 0)
				{
					obj.total += obj.getQuantityTotalHWIC();
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
				    						slevel.recovery += sublist.get(i).getQuantityRecoveryHWOC();
				    					}
				    					if(sublist.get(i).getQuantityRecoveryHWIC() > 0)
				    					{
				    						slevel.setQuantityRecoveryHWIC(slevel.getQuantityRecoveryHWIC() + sublist.get(i).getQuantityRecoveryHWIC());
				    						slevel.recovery += sublist.get(i).getQuantityRecoveryHWIC();
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
				    						slevel.disposal +=sublist.get(i).getQuantityDisposalHWIC();
				    					}
				    					if(sublist.get(i).getQuantityDisposalHWOC() > 0)
				    					{
				    						slevel.setQuantityDisposalHWOC(slevel.getQuantityDisposalHWOC() + sublist.get(i).getQuantityDisposalHWOC());
				    						slevel.disposal +=sublist.get(i).getQuantityDisposalHWOC();
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
				    						slevel.unspec +=  sublist.get(i).getQuantityUnspecHWIC();
				    					}
				    					if(sublist.get(i).getQuantityUnspecHWOC() > 0)
				    					{
				    						slevel.setQuantityUnspecHWOC(slevel.getQuantityUnspecHWOC() + sublist.get(i).getQuantityUnspecHWOC());
				    						slevel.unspec +=sublist.get(i).getQuantityUnspecHWOC();
				    					}		
				    				}
				    			
				    				// Total		
				    				if(sublist.get(i).getQuantityTotalHWIC() > 0)
									{
				    					slevel.setQuantityTotalHWIC(slevel.getQuantityTotalHWIC() + sublist.get(i).getQuantityTotalHWIC());
									}
				    				if(sublist.get(i).getQuantityTotalHWOC() > 0)
									{
				    					slevel.setQuantityTotalHWOC(slevel.getQuantityTotalHWOC() + sublist.get(i).getQuantityTotalHWOC());
									}
				    				if(sublist.get(i).getQuantityTotalNONHW() > 0)
									{
				    					slevel.setQuantityTotalNONHW(slevel.getQuantityTotalNONHW() + sublist.get(i).getQuantityTotalNONHW());
									}
				    				
				    				if(sublist.get(i).getQuantityTotalHWOC() > 0)
				    				{
				    					slevel.total += sublist.get(i).getQuantityTotalHWOC();
				    				}
				    				if(sublist.get(i).getQuantityTotalHWIC() > 0)
				    				{
				    					slevel.total += sublist.get(i).getQuantityTotalHWIC();
				    				}
									
									slevel.facilityCount +=1;
									sublevelexist = true;
									break;
								}
							}
							if(!sublevelexist)
							{
								if(sublist.get(i).isHasReportedRecovery())
			    				{
			    					if(sublist.get(i).getQuantityRecoveryHWOC() > 0)
			    					{	
			    						sublist.get(i).recovery += sublist.get(i).getQuantityRecoveryHWOC();
			    					}
			    					if(sublist.get(i).getQuantityRecoveryHWIC() > 0)
			    					{
			    						sublist.get(i).recovery += sublist.get(i).getQuantityRecoveryHWIC();
			    					}
			    				}
			    				
			    				if(sublist.get(i).isHasReportedDisposal())
			    				{
			    					if(sublist.get(i).getQuantityDisposalHWIC() > 0)
			    					{
			    						sublist.get(i).disposal +=sublist.get(i).getQuantityDisposalHWIC();
			    					}
			    					if(sublist.get(i).getQuantityDisposalHWOC() > 0)
			    					{
			    						sublist.get(i).disposal +=sublist.get(i).getQuantityDisposalHWOC();
			    					}
			    				}
			    			
			    				if(sublist.get(i).isHasReportedUnspecified())
			    				{
			    					if(sublist.get(i).getQuantityUnspecHWIC() > 0)
			    					{
			    						sublist.get(i).unspec +=  sublist.get(i).getQuantityUnspecHWIC();
			    					}
			    					if(sublist.get(i).getQuantityUnspecHWOC() > 0)
			    					{
			    						sublist.get(i).unspec +=sublist.get(i).getQuantityUnspecHWOC();
			    					}		
			    				}
			    				
			    				if(sublist.get(i).getQuantityTotalHWOC() > 0)
			    				{
			    					sublist.get(i).total += sublist.get(i).getQuantityTotalHWOC();
			    				}
			    				if(sublist.get(i).getQuantityTotalHWIC() > 0)
			    				{
			    					sublist.get(i).total += sublist.get(i).getQuantityTotalHWIC();
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
			for(int j = 0;j< element.data.size(); j++)
    		{	
    			if((regionsearch && element.data.get(j).getNutsLevel2RegionCode().equals(obj.getNutsLevel2RegionCode())) ||
    				(!regionsearch && element.data.get(j).getRiverBasinDistrictCode().equals(obj.getRiverBasinDistrictCode())))
    			{	
    				exist = true;
    				if(element.data.get(j).isHasReportedRecovery())
    				{
    					if(obj.getQuantityRecoveryNONHW() > 0)
    					{	
    						element.data.get(j).setQuantityRecoveryNONHW(element.data.get(j).getQuantityRecoveryNONHW() + obj.getQuantityRecoveryNONHW());
    					}
    					if(obj.getQuantityRecoveryHWOC() > 0)
    					{
    						element.data.get(j).setQuantityRecoveryHWOC(element.data.get(j).getQuantityRecoveryHWOC() + obj.getQuantityRecoveryHWOC());	
    						element.data.get(j).recovery += obj.getQuantityRecoveryHWOC();
    					}
    					if(obj.getQuantityRecoveryHWIC() > 0)
    					{
							element.data.get(j).setQuantityRecoveryHWIC(element.data.get(j).getQuantityRecoveryHWIC() + obj.getQuantityRecoveryHWIC());
    						element.data.get(j).recovery += obj.getQuantityRecoveryHWIC();
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
    						element.data.get(j).disposal +=obj.getQuantityDisposalHWIC();
    					}
    					if(obj.getQuantityDisposalHWOC() > 0)
    					{
    						element.data.get(j).setQuantityDisposalHWOC(element.data.get(j).getQuantityDisposalHWOC() + obj.getQuantityDisposalHWOC());
    						element.data.get(j).disposal +=obj.getQuantityDisposalHWOC();
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
    						element.data.get(j).unspec +=  obj.getQuantityUnspecHWIC();
    					}
    					if(obj.getQuantityUnspecHWOC() > 0)
    					{
    						element.data.get(j).setQuantityUnspecHWOC(element.data.get(j).getQuantityUnspecHWOC() + obj.getQuantityUnspecHWOC());
    						element.data.get(j).unspec +=obj.getQuantityUnspecHWOC();
    					}		
    				}
    			
    				// Total		
    				if(obj.getQuantityTotalHWIC() > 0)
					{
						element.data.get(j).setQuantityTotalHWIC(element.data.get(j).getQuantityTotalHWIC() + obj.getQuantityTotalHWIC());
					}
    				if(obj.getQuantityTotalHWOC() > 0)
					{
    					element.data.get(j).setQuantityTotalHWOC(element.data.get(j).getQuantityTotalHWOC() + obj.getQuantityTotalHWOC());
					}
    				if(obj.getQuantityTotalNONHW() > 0)
					{
    					element.data.get(j).setQuantityTotalNONHW(element.data.get(j).getQuantityTotalNONHW() + obj.getQuantityTotalNONHW());
					}
    				
    				if(obj.getQuantityTotalHWOC() > 0)
    				{
    					element.data.get(j).total += obj.getQuantityTotalHWOC();
    				}
    				if(obj.getQuantityTotalHWIC() > 0)
    				{
    					element.data.get(j).total += obj.getQuantityTotalHWIC();
    				}
    				element.data.get(j).facilityCount+=1;
    				break;
    			}
    		}// End foreach

			if(!exist)
    		{
    			obj.facilityCount = 1;
    			element.data.add(obj);
    		}
		}
		System.out.println("List size: "+list.size());
		return list;
	}

	private List<WasteTransferConfidentialTS> getTS(List<WastetransferConfidential> elements){
		List<WasteTransferConfidentialTS> list = new ArrayList<WasteTransferConfidentialTS>();
		//We 

		return list;
	} 
	
}
