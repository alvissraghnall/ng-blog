import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  activeTab = 'published';
  
  tabs = [
    { id: 'published', label: 'Published Posts', active: true },
    { id: 'drafts', label: 'Drafts', active: false },
    { id: 'pending', label: 'Pending Review', active: false }
  ];
  
  posts = [
    {
      id: 1,
      title: 'The Future of AI in Modern Design',
      excerpt: 'An in-depth look at how artificial intelligence is reshaping creative workflows and what it means for designers...',
      date: 'July 26, 2024',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3yoUoY7KB9vhK463U0DFQ_ldR97mB07YTg2GHPJA4pEDlGarPIOXBn-J56cV5vwcWopk_IeJ8l2TcdrRtCsQrRr7bJcKgH_WVvgdfCps2xqxH2Dh13l7GOFfHGwH3iRbI7e2BhoXZa-kCBqbffs6o-CR9sAh5kvuOyNsqwAwShRt7B36bF1c3wHj5ZdC4MQKCGHCG-NfRUnlDAo74Gc_QKmMUTypSBeAQQqaiqybf1OMP3wKvzCw_v8PiwZsjGj_NXOXr8KmEWNU'
    },
    {
      id: 2,
      title: 'A Guide to Human-Centered Design Principles',
      excerpt: 'Discover the core principles of human-centered design and how to apply them to create more intuitive and engaging user experiences.',
      date: 'June 15, 2024',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRftpUhlE5HwkeoTxYMg2nTRt53VlqvwV9A_C2FrqHa3pZ0Phvfet7mcCt1gMfaHMYvMIbN8u9l88XroKWZw7eGxQSQi03Lc3rUg7N4vCmaRq2OjtSywy5dTc1wv9ZBqQTJbMnbd1lts4zYFQePdkVt-17NcGADtHg67hdljGg72iPvCjZjjSVk-pxfPCKmVVlyh7GsKyh1sKy1eP77JytYpqinWA3dTI64sw52i4cl_soWfibJDtm8SP1mn0Y_jIHrpxhAFcj3-Y'
    },
    {
      id: 3,
      title: 'The Psychology of Color in UI Design',
      excerpt: 'Exploring how different colors impact user emotions and decisions. Learn to build more effective color palettes for your projects.',
      date: 'April 2, 2024',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlPzKPK0lRfx7EIQN9-rMtp_kCZVW_mnabGfp7sOmfGG7jyWFrlBetAIC7HOrBx06OBskw_zZG0FIkCAAzyQCzzGEm9d4VzcWX5blt0adCsRJmYkaz8Yqadr7oUxEZkwYUpqnlvy85oFizzFKgp_KIkLp7GcLDszi6_j0IkkyjzJWXg88fjqW-Edfn_P1fJzS-qIMaIzZq5UCMHJ4niVsfczXJVv2G81M_xsES84hgfH0ZxJyk6ie4Dv4FX2frHpN9t_e711AZ2b8'
    }
  ];
  
  currentPage = 1;
  totalPages = 10;
  
  selectTab(tabId: string) {
    this.activeTab = tabId;
    this.tabs.forEach(tab => {
      tab.active = tab.id === tabId;
    });
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  goToPage(page: number) {
    this.currentPage = page;
  }
}