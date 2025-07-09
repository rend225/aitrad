# PayPal Subscription Setup Guide

## 🚀 Complete Step-by-Step Guide to Create PayPal Subscription Plans

### Prerequisites
- PayPal Business Account
- Access to PayPal Developer Dashboard
- Your AI Trading platform ready for testing

---

## 📋 Step 1: Access PayPal Developer Dashboard

1. **Go to PayPal Developer Dashboard**
   - Visit: https://developer.paypal.com/
   - Click "Log into Dashboard"
   - Sign in with your PayPal Business account

2. **Navigate to Apps & Credentials**
   - Click "My Apps & Credentials" in the left sidebar
   - Make sure you're in "Live" mode for production (or "Sandbox" for testing)

---

## 🏷️ Step 2: Create Products for Each Plan

### Create Pro Plan Product

1. **Go to Products Section**
   - Click "Products" in the left sidebar
   - Click "Create Product" button

2. **Fill Product Details for Pro Plan**
   ```
   Product Name: AI Trading Pro Plan
   Product Type: Service
   Category: Software
   Description: Professional AI-powered trading signals with 5 signals per day, advanced analysis, and priority support
   Product Image: (Optional - upload your logo)
   Home Page URL: https://your-domain.com
   ```

3. **Click "Create Product"**
   - Save the Product ID (you'll need this for the subscription plan)

### Create Elite Plan Product

1. **Create Another Product**
   - Click "Create Product" again

2. **Fill Product Details for Elite Plan**
   ```
   Product Name: AI Trading Elite Plan
   Product Type: Service
   Category: Software
   Description: Elite AI-powered trading signals with 15 signals per day, VIP analysis, 24/7 support, custom strategies, and API access
   Product Image: (Optional - upload your logo)
   Home Page URL: https://your-domain.com
   ```

3. **Click "Create Product"**
   - Save the Product ID

---

## 💳 Step 3: Create Subscription Plans

### Create Pro Plan Subscription

1. **Go to Billing Plans**
   - Click "Billing Plans" in the left sidebar
   - Click "Create Plan" button

2. **Basic Information**
   ```
   Plan Name: AI Trading Pro Monthly
   Plan ID: (Auto-generated - you'll copy this)
   Product: Select "AI Trading Pro Plan" (created above)
   ```

3. **Billing Cycles**
   ```
   Billing Cycle 1:
   - Frequency: Monthly
   - Tenure Type: Regular
   - Sequence: 1
   - Total Cycles: 0 (infinite)
   - Pricing: $29.00 USD
   - Setup Fee: $0.00
   ```

4. **Payment Preferences**
   ```
   Auto Bill Outstanding: Yes
   Setup Fee Failure Action: Continue
   Payment Failure Threshold: 3
   ```

5. **Click "Create Plan"**
   - **IMPORTANT**: Copy the Plan ID (starts with "P-") - this is what you need!

### Create Elite Plan Subscription

1. **Create Another Plan**
   - Click "Create Plan" again

2. **Basic Information**
   ```
   Plan Name: AI Trading Elite Monthly
   Plan ID: (Auto-generated - you'll copy this)
   Product: Select "AI Trading Elite Plan" (created above)
   ```

3. **Billing Cycles**
   ```
   Billing Cycle 1:
   - Frequency: Monthly
   - Tenure Type: Regular
   - Sequence: 1
   - Total Cycles: 0 (infinite)
   - Pricing: $99.00 USD
   - Setup Fee: $0.00
   ```

4. **Payment Preferences**
   ```
   Auto Bill Outstanding: Yes
   Setup Fee Failure Action: Continue
   Payment Failure Threshold: 3
   ```

5. **Click "Create Plan"**
   - **IMPORTANT**: Copy the Plan ID (starts with "P-")

---

## 🔧 Step 4: Update Your Application

### Update PayPal Configuration

1. **Open `src/services/paypal.ts`**

2. **Update PAYPAL_PLAN_IDS with your Plan IDs**
   ```typescript
   export const PAYPAL_PLAN_IDS = {
     pro: 'P-YOUR-PRO-PLAN-ID-HERE',     // Replace with actual Pro Plan ID
     elite: 'P-YOUR-ELITE-PLAN-ID-HERE'  // Replace with actual Elite Plan ID
   };
   ```

### Update Firestore Plans

1. **Run the setup script to update plans**
   - Go to: http://localhost:5173/setup
   - Click "Setup All Data" to update plans with PayPal IDs

2. **Or manually update in Firebase Console**
   - Go to Firebase Console → Firestore
   - Navigate to `plans` collection
   - Update `pro` document: set `paypal_plan_id` to your Pro Plan ID
   - Update `elite` document: set `paypal_plan_id` to your Elite Plan ID

---

## 🧪 Step 5: Test Your Setup

### Test in Sandbox Mode (Recommended First)

1. **Switch to Sandbox**
   - In PayPal Developer Dashboard, switch to "Sandbox"
   - Create sandbox versions of your products and plans
   - Use sandbox Plan IDs in your app

2. **Create Test Accounts**
   - Go to "Sandbox Accounts" in PayPal Dashboard
   - Create a test buyer account
   - Use this account to test subscriptions

### Test Subscription Flow

1. **Go to Plans Page**
   - Visit: http://localhost:5173/plans
   - Verify no "Setup Required" messages appear

2. **Test Payment Flow**
   - Click "Get Started" on Pro or Elite plan
   - Complete PayPal checkout process
   - Verify subscription is created in PayPal Dashboard

---

## 🔍 Step 6: Verify Everything Works

### Check PayPal Dashboard

1. **View Subscriptions**
   - Go to PayPal Dashboard → Billing → Subscriptions
   - Verify test subscriptions appear

2. **Check Webhook Events**
   - Go to Webhooks section
   - Verify subscription events are being sent

### Check Your Application

1. **User Dashboard**
   - Verify user plan is updated after payment
   - Check daily limits are applied correctly

2. **Admin Dashboard**
   - Go to: http://localhost:5173/admin
   - Verify subscription data appears in analytics

---

## 🚨 Troubleshooting Common Issues

### "RESOURCE_NOT_FOUND" Error
- **Cause**: Plan ID doesn't exist or is incorrect
- **Solution**: Double-check Plan IDs in PayPal Dashboard and update your code

### "INVALID_RESOURCE_ID" Error
- **Cause**: Plan ID format is wrong or plan is inactive
- **Solution**: Ensure Plan ID starts with "P-" and plan is active

### Payment Button Not Appearing
- **Cause**: PayPal script not loaded or plan not configured
- **Solution**: Check browser console for errors and verify Plan IDs

### Subscription Not Activating
- **Cause**: Webhook not configured or Firestore update failing
- **Solution**: Check webhook configuration and Firestore security rules

---

## 📝 Example Plan IDs Format

Your Plan IDs should look like this:
```
Pro Plan ID:   P-5ML4271244454362WXNWU5NQ
Elite Plan ID: P-6XL9876543210987YXOWV6PR
```

---

## 🎯 Final Checklist

- [ ] PayPal Business Account created
- [ ] Products created for Pro and Elite plans
- [ ] Subscription plans created with correct pricing
- [ ] Plan IDs copied and updated in `src/services/paypal.ts`
- [ ] Firestore plans updated with PayPal Plan IDs
- [ ] Tested subscription flow in sandbox
- [ ] Verified user plan updates after payment
- [ ] Ready for production testing

---

## 🆘 Need Help?

If you encounter issues:

1. **Check PayPal Developer Documentation**
   - https://developer.paypal.com/docs/subscriptions/

2. **Verify API Credentials**
   - Ensure Client ID is correct in your `.env` file

3. **Test in Sandbox First**
   - Always test with sandbox before going live

4. **Check Browser Console**
   - Look for JavaScript errors during payment flow

---

**🎉 Once completed, your PayPal subscription system will be fully functional!**