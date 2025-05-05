import { Input, Label, Switch } from "../../../../../components/ui";

const Preferences = ({ watch, setValue }) => {
  const notificationPreferences = watch("notificationPreferences") || {};

  const handleToggle = (field) => {
    setValue(`notificationPreferences.${field}`, !notificationPreferences[field]);
  };

  const handleReminderChange = (e) => {
    setValue("notificationPreferences.reminder", parseInt(e.target.value, 10));
  };

  return (
    <div className="space-y-6">

      {/* Notifications par Email */}
      <div className="flex items-center justify-between">
        <Label htmlFor="email">Recevoir des notifications par Email</Label>
        <Switch
          id="email"
          checked={notificationPreferences.email}
          onCheckedChange={() => handleToggle("email")}
        />
      </div>

      {/* Notifications par SMS */}
      <div className="flex items-center justify-between">
        <Label htmlFor="sms">Recevoir des notifications par SMS</Label>
        <Switch
          id="sms"
          checked={notificationPreferences.sms}
          onCheckedChange={() => handleToggle("sms")}
        />
      </div>

      {/* Temps de rappel */}
      <Label htmlFor="reminder">
        Temps de rappel avant un cours (en heures)
        <Input
          id="reminder"
          type="number"
          min="1"
          step="1"
          value={notificationPreferences.reminder || 24}
          onChange={handleReminderChange}
          placeholder="Ex: 24"
        />
      </Label>

    </div>
  );
};

export default Preferences;
